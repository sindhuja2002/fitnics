import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import analyticsController from '../controllers/analyticsController.js';

const router = express.Router();

// Track a new metric
router.post('/track', protect, analyticsController.trackMetric);

// Get user analytics
router.get('/user/:userId', protect, analyticsController.getUserAnalytics);

// Generate sample data
router.post('/generate-sample/:userId', protect, analyticsController.generateSampleData);

// Get weekly analytics
router.get('/user/:userId/weekly', protect, analyticsController.getWeeklyAnalytics);

export default router; 