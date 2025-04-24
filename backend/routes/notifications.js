import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import notificationsController from '../controllers/notificationsController.js';

const router = express.Router();

// Update notification settings
router.put('/settings', protect, notificationsController.updateSettings);

// Get notification settings
router.get('/settings', protect, notificationsController.getSettings);

// Send test notification
router.post('/test', protect, notificationsController.sendTestNotification);

export default router; 