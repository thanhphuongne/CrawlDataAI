import Express from 'express';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import app from './api/index';

import {
  SERVER_PORT,
  USE_EXPRESS_HOST_STATIC_FILE,
  NODE_APP_INSTANCE,
  USER_JWT_SECRET_KEY,
} from './config';
import logger from './util/logger';

import { sequelize, authenticateDatabase } from './db/connection';
import { connectMongoDB } from './db/mongoConnection';
import CategorySchema from './components/category/category.model';
import SubmitRequest from './components/submit-request/submitRequest.model';
import HistoryComments from './components/submit-request/HistoryComments.model';
import User from './components/user/user.model';
import Request from './components/ai-chat/request.model';
// Import Mongoose models to register them
import './components/ai-chat/crawledData.model';
import './components/ai-chat/conversation.model';
import * as ConversationService from './components/ai-chat/conversation.service';
import * as RequestService from './components/ai-chat/request.service';
import { processUserMessage, generateResponse } from './util/aiService';
import { executeCrawling } from './util/crawler';
import APIError from './util/APIError';
// Define relationships
CategorySchema.hasMany(SubmitRequest, { foreignKey: 'categoryId', as: 'submitRequests' });
SubmitRequest.belongsTo(CategorySchema, { foreignKey: 'categoryId', as: 'category' });
SubmitRequest.belongsTo(User, { foreignKey: 'supervisor',  as: 'supervisorInfo'});
SubmitRequest.belongsTo(User, { foreignKey: 'createBy',  as: 'userCreate'});
HistoryComments.belongsTo(User, { foreignKey: 'commentBy', as: 'commenter' });
User.hasMany(HistoryComments, { foreignKey: 'commentBy', as: 'comments' });

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust for production
    methods: ["GET", "POST"]
  }
});

const startServer = async () => {
  try {
    await Promise.all([authenticateDatabase(), connectMongoDB()]);
    
    await sequelize.sync({ force: false });
    
    // Add verification/login columns if they don't exist
    try {
      await sequelize.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS "account_name" VARCHAR(255)`);
      await sequelize.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS "verify_code" VARCHAR(255)`);
      await sequelize.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP WITH TIME ZONE`);
      await sequelize.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP WITH TIME ZONE`);
      await sequelize.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS "is_verified" BOOLEAN DEFAULT false`);
      await sequelize.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS "otp_expires_at" TIMESTAMP WITH TIME ZONE`);
      await sequelize.query(`UPDATE users SET "account_name" = email WHERE "account_name" IS NULL`);
      await sequelize.query(`UPDATE users SET "created_at" = CURRENT_TIMESTAMP WHERE "created_at" IS NULL`);
      await sequelize.query(`UPDATE users SET "updated_at" = CURRENT_TIMESTAMP WHERE "updated_at" IS NULL`);
      await sequelize.query(`UPDATE users SET "is_verified" = true WHERE "is_verified" IS NULL OR "is_verified" = false`);
      console.log('✓ Auth columns ensured');
    } catch (e) {
      console.log('Note: Auth columns may already exist');
    }
    
    console.log('PostgreSQL tables created successfully');

    if (USE_EXPRESS_HOST_STATIC_FILE === true) {
      app.use('/uploads', Express.static(path.resolve(__dirname, '../uploads')));
      app.use('/flow-data', Express.static(path.resolve(__dirname, '../flow-data')));
      app.use('/cache', Express.static(path.resolve(__dirname, '../cache')));
      app.use(Express.static(path.join(__dirname, 'public')));

    }

    // WebSocket setup
    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      // Authenticate on connection using token from query
      const token = socket.handshake.query.token;
      
      if (!token) {
        console.error('❌ No token provided');
        socket.disconnect();
        return;
      }

      // DEVELOPMENT MODE: Allow test connections without valid token
      if (token === 'test-token') {
        console.log('✅ Test connection accepted - DEVELOPMENT MODE');
        socket.user = { id: 'test-user' }; // Use a test user ID
        
        // No conversation history for test user
        socket.emit('conversation_history', {
          messages: [],
          conversation_id: null
        });
        return; // Early return for test connections
      }

      // Production JWT verification
      try {
        // Verify JWT
        const decoded = jwt.verify(token, USER_JWT_SECRET_KEY);
        socket.user = { id: decoded._id || decoded.id };
        console.log('✅ JWT verified for user:', socket.user.id);

        // Send conversation history on connection
        ConversationService.getOrCreateGeneralConversation(socket.user.id)
          .then(conversation => {
            console.log('✅ Conversation history loaded for user:', socket.user.id);
            socket.emit('conversation_history', {
              messages: conversation.messages || [],
              conversation_id: conversation._id
            });
          })
          .catch(error => {
            console.error('❌ Error loading conversation history:', error);
            // Don't disconnect on history error, just send empty history
            socket.emit('conversation_history', {
              messages: [],
              conversation_id: null
            });
          });
      } catch (err) {
        console.error('❌ JWT verification failed:', err.message);
        socket.disconnect();
        return;
      }

      socket.on('chat_message', async (data) => {
        const { content, request_id } = data;
        if (!socket.user) return;

        try {
          // Save user message to general conversation (skip for test users)
          if (socket.user.id !== 'test-user') {
            await ConversationService.sendMessageToGeneralConversation(socket.user.id, content, 'user');
          }

          // Process message with AI
          const aiResult = await processUserMessage(content);

          if (aiResult.isDataRequest) {
            // Send formatted requirement for approval
            socket.emit('data_request_proposal', {
              requirement: aiResult.formattedRequirement,
              explanation: aiResult.explanation,
              message_id: Date.now() // Simple ID for tracking
            });
          } else {
            // Generate normal AI response
            const aiResponse = await generateResponse(content);

            // Save AI response to general conversation (skip for test users)
            if (socket.user.id !== 'test-user') {
              await ConversationService.sendMessageToGeneralConversation(socket.user.id, aiResponse, 'assistant');
            }

            socket.emit('chat_response', { message: aiResponse, request_id });
          }
        } catch (error) {
          console.error('Error processing chat message:', error);
          socket.emit('chat_response', { message: 'Sorry, I encountered an error. Please try again.', request_id });
        }
      });

      // Handle approval of data request
      socket.on('approve_data_request', async (data) => {
        const { requirement, message_id } = data;
        if (!socket.user) return;

        try {
          // Create a new crawl request
          const request = await RequestService.createRequest(socket.user.id, requirement);

          // Send confirmation
          socket.emit('data_request_approved', {
            request_id: request.id,
            status: request.status,
            message: 'Data crawling request has been created and will start processing.',
            export_formats: ['json', 'xlsx'],
            export_url: `/api/data/${request.id}/`
          });

          // Trigger actual crawling process
          executeCrawling(request.id, requirement)
            .then(() => {
              console.log(`Crawling completed for request ${request.id}`);
              socket.emit('crawling_completed', {
                request_id: request.id,
                message: 'Data crawling has been completed successfully.'
              });
            })
            .catch((error) => {
              console.error(`Crawling failed for request ${request.id}:`, error);
              socket.emit('crawling_failed', {
                request_id: request.id,
                message: 'Data crawling failed. Please try again.'
              });
            });
        } catch (error) {
          console.error('Error creating data request:', error);
          socket.emit('data_request_error', { message: 'Failed to create data request. Please try again.' });
        }
      });

      // Handle rejection of data request
      socket.on('reject_data_request', async (data) => {
        const { message_id } = data;
        if (!socket.user) return;

        socket.emit('data_request_rejected', {
          message: 'Data request cancelled. You can try rephrasing your request.'
        });
      });

      socket.on('disconnect', (reason) => {
        console.log('User disconnected:', socket.id, 'Reason:', reason);
      });
    });

    // Start HTTP server after all initialization is complete
    server.listen(SERVER_PORT, (error) => {
      if (error) {
        logger.error('Cannot start backend services:');
        logger.error(error);
        process.exit(1);
      } else {
        logger.info(`Backend service is running on port: ${SERVER_PORT}${NODE_APP_INSTANCE ? ` on core ${NODE_APP_INSTANCE}` : ''}!`);
        console.log('✓ Server is ready and listening for connections');
        console.log(`✓ WebSocket chat available at ws://localhost:${SERVER_PORT}`);
        console.log(`✓ REST API available at http://localhost:${SERVER_PORT}/api`);
        console.log('✓ Press Ctrl+C to stop the server');
      }
    });
  } catch (error) {
    console.error('Unable to start backend services:');
    console.error(error);
    process.exit(1);
  }
};

// Start the server
startServer().catch((error) => {
  console.error('Fatal error during server startup:');
  console.error(error);
  process.exit(1);
});

// Prevent process from crashing on unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

app.set('view engine', 'ejs');
app.use((err, req, res, next) => {
  if (err instanceof APIError) {
    // Return both message and errors for better frontend compatibility
    const response = {
      success: false,
      message: err.message || 'An error occurred',
    };
    
    if (err.errors) {
      response.errors = err.errors;
    }
    
    console.log(`[API Error] Status: ${err.statusCode}, Message: ${err.message}`);
    console.log('[API Error] Response:', JSON.stringify(response));
    
    return res.status(err.statusCode || 500).json(response);
  }

  console.error('Unhandled error:', err);
  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    errors: [
      {
        msg: 'Internal Server Error',
        param: 'internal'
      }
    ]
  });
});
