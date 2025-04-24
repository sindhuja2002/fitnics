import axios from 'axios';

const MICROSERVICE_URL = process.env.MICROSERVICE_URL || 'http://localhost:8000';

class NotificationsController {
    async updateSettings(req, res) {
        try {
            const { phone_number, enabled, reminder_times, notification_types } = req.body;
            const user_id = req.params.userId;

            const response = await axios.put(
                `${MICROSERVICE_URL}/api/v1/notifications/settings/${user_id}`,
                {
                    phone_number,
                    enabled,
                    reminder_times,
                    notification_types
                }
            );

            res.json({
                success: true,
                data: response.data
            });
        } catch (error) {
            console.error('Error updating notification settings:', error);
            res.status(error.response?.status || 500).json({
                success: false,
                error: error.response?.data?.detail || 'Failed to update notification settings'
            });
        }
    }

    async getSettings(req, res) {
        try {
            const user_id = req.params.userId;

            const response = await axios.get(
                `${MICROSERVICE_URL}/api/v1/notifications/settings/${user_id}`
            );

            res.json({
                success: true,
                data: response.data
            });
        } catch (error) {
            console.error('Error getting notification settings:', error);
            res.status(error.response?.status || 500).json({
                success: false,
                error: error.response?.data?.detail || 'Failed to get notification settings'
            });
        }
    }

    async sendTestNotification(req, res) {
        try {
            const user_id = req.params.userId;

            const response = await axios.post(
                `${MICROSERVICE_URL}/api/v1/notifications/test/${user_id}`
            );

            res.json({
                success: true,
                data: response.data
            });
        } catch (error) {
            console.error('Error sending test notification:', error);
            res.status(error.response?.status || 500).json({
                success: false,
                error: error.response?.data?.detail || 'Failed to send test notification'
            });
        }
    }

    async updateNotificationSettings(req, res) {
        try {
            const { user_id, phone_number, enabled, reminder_times, notification_types } = req.body;

            console.log(`Updating notification settings for user ${user_id}`);
            console.log(`Microservice URL: ${MICROSERVICE_URL}`);
            console.log('Request body:', { user_id, phone_number, enabled, reminder_times, notification_types });

            const response = await axios.put(
                `${MICROSERVICE_URL}/api/v1/notifications/settings/${user_id}`,
                {
                    user_id,
                    phone_number,
                    enabled,
                    reminder_times: reminder_times || [],
                    notification_types: notification_types || [],
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    timeout: 60000,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Microservice response:', response.data);
            res.json({
                success: true,
                data: response.data
            });
        } catch (error) {
            console.error('Error updating notification settings:', error.message);
            console.error('Error details:', error.response?.data);
            console.error('Error stack:', error.stack);
            res.status(error.response?.status || 500).json({
                success: false,
                error: error.response?.data?.detail || error.message || 'Failed to update notification settings'
            });
        }
    }
}

export default new NotificationsController(); 