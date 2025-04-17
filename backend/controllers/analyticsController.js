import axios from 'axios';

const MICROSERVICE_URL = process.env.MICROSERVICE_URL || 'http://localhost:8000';

class AnalyticsController {
    async trackMetric(req, res) {
        try {
            const { metric_type, value, metadata } = req.body;
            const user_id = req.user._id;

            const response = await axios.post(
                `${MICROSERVICE_URL}/api/v1/analytics/track`,
                {
                    user_id,
                    metric_type,
                    value,
                    metadata: {
                        ...metadata,
                        source: 'manual_entry',
                        timestamp: new Date().toISOString()
                    }
                }
            );

            res.json({
                success: true,
                data: response.data
            });
        } catch (error) {
            console.error('Error tracking metric:', error);
            res.status(500).json({
                success: false,
                error: error.response?.data?.detail || 'Failed to track metric'
            });
        }
    }

    async getUserAnalytics(req, res) {
        try {
            const user_id = req.user._id;
            const { start_date, end_date, metric_type } = req.query;

            const response = await axios.get(
                `${MICROSERVICE_URL}/api/v1/analytics/user/${user_id}`,
                {
                    params: {
                        start_date,
                        end_date,
                        metric_type
                    }
                }
            );

            res.json({
                success: true,
                data: response.data
            });
        } catch (error) {
            console.error('Error getting user analytics:', error);
            res.status(500).json({
                success: false,
                error: error.response?.data?.detail || 'Failed to get analytics'
            });
        }
    }

    async generateSampleData(req, res) {
        try {
            const user_id = req.user._id;
            const { days = 30 } = req.query;

            const response = await axios.post(
                `${MICROSERVICE_URL}/api/v1/analytics/generate-sample/${user_id}`,
                null,
                {
                    params: { days }
                }
            );

            res.json({
                success: true,
                data: response.data
            });
        } catch (error) {
            console.error('Error generating sample data:', error);
            res.status(500).json({
                success: false,
                error: error.response?.data?.detail || 'Failed to generate sample data'
            });
        }
    }

    async getWeeklyAnalytics(req, res) {
        try {
            const user_id = req.user._id;

            const response = await axios.get(
                `${MICROSERVICE_URL}/api/v1/analytics/user/${user_id}/weekly`
            );

            res.json({
                success: true,
                data: response.data
            });
        } catch (error) {
            console.error('Error getting weekly analytics:', error);
            res.status(500).json({
                success: false,
                error: error.response?.data?.detail || 'Failed to get weekly analytics'
            });
        }
    }
}

export default new AnalyticsController(); 