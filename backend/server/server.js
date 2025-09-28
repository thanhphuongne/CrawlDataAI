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
import './components/ai-chat/dialog.model';
import * as DialogService from './components/ai-chat/dialog.service';
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

        // Save message
        await DialogService.sendMessage(socket.user.id, request_id, content);

        // Echo back
        socket.emit('chat_response', { message: 'Message received', request_id });

        // TODO: Trigger AI response or crawl updates
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
