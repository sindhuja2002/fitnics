import axios from 'axios';

const MICROSERVICE_URL = process.env.MICROSERVICE_URL || 'http://localhost:8000';

class AnalyticsController {
    async trackMetric(req, res) {
        try {
            const { metric_type, value, metadata } = req.body;
            const user_id = req.params.userId || req.user._id;

            console.log(`Tracking metric for user ${user_id} with type ${metric_type}`);
            console.log(`Microservice URL: ${MICROSERVICE_URL}`);
            console.log('Request body:', { metric_type, value, metadata });

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
            console.error('Error tracking metric:', error.message);
            console.error('Error details:', error.response?.data);
            console.error('Error stack:', error.stack);
            res.status(error.response?.status || 500).json({
                success: false,
                error: error.response?.data?.detail || error.message || 'Failed to track metric'
            });
        }
    }

    async getUserAnalytics(req, res) {
        try {
            const user_id = req.params.userId || req.user._id;
            const { start_date, end_date, metric_type } = req.query;

            console.log(`Getting analytics for user ${user_id}`);
            console.log(`Query params:`, { start_date, end_date, metric_type });
            console.log(`Microservice URL: ${MICROSERVICE_URL}`);

            const response = await axios.get(
                `${MICROSERVICE_URL}/api/v1/analytics/user/${user_id}`,
                {
                    params: {
                        start_date,
                        end_date,
                        metric_type
                    },
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
            console.error('Error getting user analytics:', error.message);
            console.error('Error details:', error.response?.data);
            console.error('Error stack:', error.stack);
            res.status(error.response?.status || 500).json({
                success: false,
                error: error.response?.data?.detail || error.message || 'Failed to get analytics'
            });
        }
    }

    async generateSampleData(req, res) {
        try {
            const user_id = req.params.userId || req.user._id;
            const { days = 30 } = req.query;

            console.log(`Generating sample data for user ${user_id}`);
            console.log(`Microservice URL: ${MICROSERVICE_URL}`);
            console.log('Request params:', { days });

            const response = await axios.post(
                `${MICROSERVICE_URL}/api/v1/analytics/generate-sample/${user_id}`,
                null,
                {
                    params: { days },
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
            console.error('Error generating sample data:', error.message);
            console.error('Error details:', error.response?.data);
            console.error('Error stack:', error.stack);
            res.status(error.response?.status || 500).json({
                success: false,
                error: error.response?.data?.detail || error.message || 'Failed to generate sample data'
            });
        }
    }

    async getWeeklyAnalytics(req, res) {
        try {
            const user_id = req.params.userId || req.user._id;
            const { week_start } = req.query;

            console.log(`Getting weekly analytics for user ${user_id}`);
            console.log(`Week start: ${week_start}`);
            console.log(`Microservice URL: ${MICROSERVICE_URL}`);

            const response = await axios.get(
                `${MICROSERVICE_URL}/api/v1/analytics/user/${user_id}/weekly`,
                {
                    params: { week_start },
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
            console.error('Error getting weekly analytics:', error.message);
            console.error('Error details:', error.response?.data);
            console.error('Error stack:', error.stack);
            res.status(error.response?.status || 500).json({
                success: false,
                error: error.response?.data?.detail || error.message || 'Failed to get weekly analytics'
            });
        }
    }
}

export default new AnalyticsController(); 