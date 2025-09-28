import { Router } from 'express';
import authRoutes from './auth/auth.route';
import requestRoutes from './requests/request.route';
import dialogRoutes from './dialogs/dialog.route';
import dataRoutes from './data/data.route';
import userRoutes from './users/user.route';

const router = new Router();

// Authentication routes
router.use('/auth', authRoutes);

// Crawl request routes
router.use('/requests', requestRoutes);

// Dialog routes
router.use('/dialogs', dialogRoutes);

// Data routes
router.use('/data', dataRoutes);
router.use('/exports', dataRoutes); // For exports

// User routes
router.use('/users', userRoutes);

export default router;