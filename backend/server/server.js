import Express from 'express';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
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

Promise.all([authenticateDatabase(), connectMongoDB()])
  .then(() => {
    sequelize.sync({ force: false })
      .then(() => {
        console.log('PostgreSQL tables created successfully');
      })
      .catch(err => {
        console.error('Error creating PostgreSQL tables:', err);
      });

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
      if (token) {
        try {
          // Verify JWT
          const jwt = require('jsonwebtoken');
          const decoded = jwt.verify(token, USER_JWT_SECRET_KEY);
          socket.user = { id: decoded._id || decoded.id };

          // Send conversation history on connection
          ConversationService.getOrCreateGeneralConversation(socket.user.id)
            .then(conversation => {
              socket.emit('conversation_history', {
                messages: conversation.messages || [],
                conversation_id: conversation._id
              });
            })
            .catch(error => {
              console.error('Error loading conversation history:', error);
            });
        } catch (err) {
          socket.disconnect();
          return;
        }
      } else {
        socket.disconnect();
        return;
      }

      socket.on('chat_message', async (data) => {
        const { content, request_id } = data;
        if (!socket.user) return;

        try {
          // Save user message to general conversation
          await ConversationService.sendMessageToGeneralConversation(socket.user.id, content, 'user');

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

            // Save AI response to general conversation
            await ConversationService.sendMessageToGeneralConversation(socket.user.id, aiResponse, 'assistant');

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

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
  })
  .catch((error) => {
    console.error('Unable to start backend services:');
    console.error(error);
  });

app.set('view engine', 'ejs');
app.use((err, req, res, next) => {
  if (err instanceof APIError) {
    return res.status(err.status).json({
      errors: err.errors
    });
  }

  console.error('Unhandled error:', err);
  return res.status(500).json({
    errors: [
      {
        msg: 'Internal Server Error',
        param: 'internal'
      }
    ]
  });
});

server.listen(SERVER_PORT, (error) => {
  if (error) {
    logger.error('Cannot start backend services:');
    logger.error(error);
  } else {
    logger.info(`Backend service is running on port: ${SERVER_PORT}${NODE_APP_INSTANCE ? ` on core ${NODE_APP_INSTANCE}` : ''}!`);
  }
});

export default app;
