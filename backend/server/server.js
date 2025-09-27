import Express from 'express';
import path from 'path';
import app from './api/index';

import {
  SERVER_PORT,
  USE_EXPRESS_HOST_STATIC_FILE,
  NODE_APP_INSTANCE,
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
// Define relationships
CategorySchema.hasMany(SubmitRequest, { foreignKey: 'categoryId', as: 'submitRequests' });
SubmitRequest.belongsTo(CategorySchema, { foreignKey: 'categoryId', as: 'category' });
SubmitRequest.belongsTo(User, { foreignKey: 'supervisor',  as: 'supervisorInfo'});
SubmitRequest.belongsTo(User, { foreignKey: 'createBy',  as: 'userCreate'});
HistoryComments.belongsTo(User, { foreignKey: 'commentBy', as: 'commenter' });
User.hasMany(HistoryComments, { foreignKey: 'commentBy', as: 'comments' });

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
app.listen(SERVER_PORT, (error) => {
  if (error) {
    logger.error('Cannot start backend services:');
    logger.error(error);
  } else {
    logger.info(`Backend service is running on port: ${SERVER_PORT}${NODE_APP_INSTANCE ? ` on core ${NODE_APP_INSTANCE}` : ''}!`);
  }
});

export default app;
