// db.js

import { Sequelize } from 'sequelize';
import {
  DB_HOST,
  DB_PORT,
  DB_PART,
  DB_DATABASE,
  DB_USERNAME,
  DB_PASSWORD
} from './../config';

// Sequelize Connection
const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
// const sequelize = new Sequelize({
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres', // 'postgres',
  // storage: DB_PART,
  // Các tùy chọn khác nếu cần
  pool: {
    max: 10, // maximum number of connection in pool
    min: 0, // minimum number of connection in pool
    acquire: 30000, // maximum time, in milliseconds, that pool will try to get connection before throwing error
    idle: 10000 // maximum time, in milliseconds, that a connection can be idle before being released
  }
});

// Kiểm tra kết nối
async function authenticateDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

// Export đối tượng kết nối
export { sequelize, authenticateDatabase };
