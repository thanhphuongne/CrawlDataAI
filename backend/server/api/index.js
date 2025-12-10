import path from 'path';
import Express from 'express';
import i18n from 'i18n';
import cors from 'cors';
import compression from 'compression';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { CORS_OPTIONS } from '../config';
import errorHandler from './errorHandler';
import routeV1 from './v1';
import routeApi from './api';
import { DEFAULT_LANGUAGE } from '../constants';

const app = new Express();

// Security middleware - MUST be first
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Adjust for production
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Cookie parser for HttpOnly cookies
app.use(cookieParser());

// Note: All request handle use CORS must be write bellow CORS settings
app.use(cors(CORS_OPTIONS));
if (process.env.NODE_ENV === 'development') {
  app.use('/uploads', Express.static(path.resolve(__dirname, '../../uploads')));
  app.use('/public', Express.static(path.resolve(__dirname, '../../public')));
}
app.use(compression());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));

// Multi Languages
i18n.configure({
  locales: ['en', 'vi'],
  directory: path.resolve(__dirname, '../../locales'),
  updateFiles: false,
  defaultLocale: DEFAULT_LANGUAGE,
});
app.use(i18n.init);
app.use((req, res, next) => {
  const language = req.header('Content-Language');
  req.lang = language || DEFAULT_LANGUAGE;
  next();
});

app.use('/v1', routeV1);
app.use('/api', routeApi);

app.use(errorHandler);

export default app;
