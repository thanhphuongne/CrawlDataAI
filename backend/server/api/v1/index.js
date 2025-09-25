import morgan from 'morgan';
import swaggerUI from 'swagger-ui-express';
import { Router } from 'express';
import { MORGAN_FORMAT } from '../../constants';
import { NODE_ENV } from '../../config';
import swaggerSpecV1 from './docs';

import userRoute from '../../components/user/user.route';
import submitRequest from '../../components/submit-request/submitRequest.route';
// import chartRoute from '../../components/chart/chart.route';
import categoryRoute from '../../components/category/category.route';
// import workflowRoute from '../../components/workflow/workflow.route';
// import assetRoute from '../../components/asset/asset.route';

const router = new Router();

// router.use('/assets', [assetRoute]);
router.use('/users', [userRoute]);
router.use('/submit-request', [submitRequest]);
// router.use('/chart', [chartRoute]);
// router.use('/product', [sampleRoute]);
// router.use('/flow', [workflowRoute]);

// router.use('/locations', [locationRoute]);
router.use('/categories', [categoryRoute]);

// Docs
if (NODE_ENV === 'development' || NODE_ENV === 'staging') {
  router.use(morgan(MORGAN_FORMAT, {
    skip: (req, res) => {
      if (req.originalUrl.includes('api-docs')) {
        return true;
      }
      return res.statusCode < 400;
    },
    stream: process.stderr,
  }));
  router.use(morgan(MORGAN_FORMAT, {
    skip: (req, res) => {
      if (req.originalUrl.includes('api-docs')) {
        return true;
      }
      return res.statusCode >= 400;
    },
    stream: process.stdout,
  }));
  const swaggerUiOptions = {
    swaggerOptions: {
      requestInterceptor: (req) => {
        if (req.headers.Authorization && !req.headers.Authorization.startsWith('Bearer ')) {
          req.headers.Authorization = `Bearer ${req.headers.Authorization}`;
        }
        return req;
      },
    },
  };
  
  // Set up Swagger UI
  router.use('/api-docs', swaggerUI.serveWithOptions({
    cacheControl: false
  }), swaggerUI.setup(swaggerSpecV1,swaggerUiOptions));

  router.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpecV1);
  });
} else {
  router.use(morgan(MORGAN_FORMAT, {
    skip: (req, res) => res.statusCode < 400,
    stream: process.stderr,
  }));
  router.use(morgan(MORGAN_FORMAT, {
    skip: (req, res) => res.statusCode >= 400,
    stream: process.stdout,
  }));
}
export default router;
