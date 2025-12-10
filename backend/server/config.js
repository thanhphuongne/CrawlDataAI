/**
 * The config for server
 */

export const SERVER_PORT = process.env.SERVER_PORT;
export const NODE_ENV = process.env.NODE_ENV;
export const NODE_APP_INSTANCE = Number(process.env.NODE_APP_INSTANCE || 0).valueOf();
let serverOrigin = process.env.SERVER_ORIGIN || '*';

try {
  serverOrigin = JSON.parse(serverOrigin);
} catch (e) {
  console.log(`Server Origin is ${serverOrigin}`);
}

export const CORS_OPTIONS = {
  // Find and fill your options here: https://github.com/expressjs/cors#configuration-options
  origin: serverOrigin,
  methods: 'GET,PUT,POST,DELETE',
  allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization,Accept-Language',
  credentials: true, // Required for cookies
};

export const USE_EXPRESS_HOST_STATIC_FILE = process.env.USE_EXPRESS_HOST_STATIC_FILE === 'true';
export const API_DOCS_HOST = process.env.API_DOCS_HOST;
export const UPLOAD_GET_HOST = process.env.UPLOAD_GET_HOST;
export const FRONTEND_HOST = process.env.FRONTEND_HOST;
export const LOGO_URL = process.env.LOGO_URL;

// Service config
const MONGO_USERNAME = process.env.MONGO_INITDB_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_INITDB_PASSWORD;
const MONGO_DATABASE = process.env.MONGO_INITDB_DATABASE;
const MONGO_HOST = process.env.MONGO_HOST;
const MONGO_PORT = process.env.MONGO_PORT;

// Support direct MONGO_URI or build from separate variables
export const MONGO_URI = process.env.MONGO_URI || `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}?retryWrites=true`;
export const RUN_CRON_JOB = process.env.RUN_CRON_JOB === 'yes';

// Auth
export const USER_JWT_SECRET_KEY = process.env.USER_JWT_SECRET_KEY;
export const USER_JWT_SECRET_KEY_FORGOT_PASSWORD = process.env.USER_JWT_SECRET_KEY_FORGOT_PASSWORD;

// User
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
export const SENDER_EMAIL = process.env.SENDER_EMAIL;
export const SENDER_NAME = process.env.SENDER_NAME;

// PosgreSQL
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = process.env.DB_PORT;
export const DB_DATABASE = process.env.DB_DATABASE;
export const DB_USERNAME = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_PART = process.env.DB_PART;

export const RSCRIPT_PATH = process.env.RSCRIPT_PATH;

export const MAX_WORKFLOW_RETRY = process.env.MAX_WORKFLOW_RETRY;
export const RETRY_WAIT_TIME = process.env.RETRY_WAIT_TIME;

export const AWS_REGION = process.env.AWS_REGION;
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
export const FROMEMAIL = process.env.FROMEMAIL;

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;