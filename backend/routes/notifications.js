import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import notificationsController from '../controllers/notificationsController.js';

const router = express.Router();

// Update notification settings
router.put('/settings/:userId', protect, notificationsController.updateSettings);

// Get notification settings
router.get('/settings/:userId', protect, notificationsController.getSettings);

// Send test notification
router.post('/test/:userId', protect, notificationsController.sendTestNotification);

router.post('/settings', protect, notificationsController.updateNotificationSettings);

export default router; 