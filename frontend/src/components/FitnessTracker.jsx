import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaDumbbell, FaHeartbeat, FaBed, FaWeight, FaFireAlt, FaWalking } from 'react-icons/fa';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:9000';

const FitnessTracker = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const [metricData, setMetricData] = useState({
        metric_type: 'steps',
        value: '',
        metadata: {
            source: 'manual_entry',
            timestamp: new Date().toISOString()
        }
    });
    const [feedback, setFeedback] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [todayMetrics, setTodayMetrics] = useState({});

    const metricTypes = [
        { value: 'steps', label: 'Steps', icon: FaWalking, unit: 'steps', min: 0, max: 100000, color: '#4CAF50' },
        { value: 'calories_burned', label: 'Calories Burned', icon: FaFireAlt, unit: 'kcal', min: 0, max: 5000, color: '#FF5722' },
        { value: 'workout_duration', label: 'Workout Duration', icon: FaDumbbell, unit: 'minutes', min: 0, max: 300, color: '#2196F3' },
        { value: 'heart_rate', label: 'Heart Rate', icon: FaHeartbeat, unit: 'bpm', min: 40, max: 220, color: '#E91E63' },
        { value: 'weight', label: 'Weight', icon: FaWeight, unit: 'kg', min: 20, max: 300, color: '#9C27B0' },
        { value: 'sleep_duration', label: 'Sleep Duration', icon: FaBed, unit: 'hours', min: 0, max: 24, color: '#3F51B5' }
    ];

    useEffect(() => {
        fetchTodayMetrics();
    }, [userInfo]);

    const fetchTodayMetrics = async () => {
        if (!userInfo?.token) {
            console.error('No authentication token found');
            return;
        }

        try {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            
            const response = await axios.get(
                `${API_BASE_URL}/api/analytics/user/${userInfo._id}`,
                {
                    headers: { 
                        Authorization: `Bearer ${userInfo.token}`,
                        'Content-Type': 'application/json'
                    },
                    params: { start_date: startOfDay.toISOString() }
                }
            );

            if (response.data.success) {
                const metrics = response.data.data.metrics.reduce((acc, metric) => {
                    acc[metric.metric_type] = metric.value;
                    return acc;
                }, {});
                setTodayMetrics(metrics);
            }
        } catch (error) {
            console.error('Error fetching today\'s metrics:', error);
            if (error.response?.status === 401) {
                setFeedback({
                    type: 'danger',
                    message: 'Your session has expired. Please log in again.'
                });
            } else {
                setFeedback({
                    type: 'danger',
                    message: error.response?.data?.error || 'Failed to fetch metrics'
                });
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userInfo?.token) {
            setFeedback({
                type: 'danger',
                message: 'No authentication token found. Please log in again.'
            });
            return;
        }

        setLoading(true);
        setFeedback({ type: '', message: '' });

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/analytics/track`,
                {
                    ...metricData,
                    value: parseFloat(metricData.value)
                },
                {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                setFeedback({
                    type: 'success',
                    message: 'Fitness metric tracked successfully!'
                });
                setMetricData({ ...metricData, value: '' });
                fetchTodayMetrics(); // Refresh today's metrics
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setFeedback({
                    type: 'danger',
                    message: 'Your session has expired. Please log in again.'
                });
            } else {
                setFeedback({
                    type: 'danger',
                    message: error.response?.data?.error || 'Failed to track metric'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const getCurrentMetricType = () => {
        return metricTypes.find(type => type.value === metricData.metric_type) || metricTypes[0];
    };

    const getProgressPercentage = (value, min, max) => {
        return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
    };

    const getMetricTip = (metricType) => {
        const tips = {
            steps: "Aim for 10,000 steps daily. Try taking the stairs or walking during calls!",
            calories_burned: "A healthy daily calorie burn includes both active exercise and regular movement throughout the day.",
            workout_duration: "Mix cardio and strength training. Aim for 150 minutes of moderate exercise per week.",
            heart_rate: "Your target heart rate during exercise should be between 50-85% of your maximum heart rate.",
            weight: "Weight fluctuates naturally. Weigh yourself at the same time each day for consistency.",
            sleep_duration: "Adults need 7-9 hours of quality sleep. Maintain a consistent sleep schedule!"
        };
        return tips[metricType] || "Track your progress regularly for better results!";
    };

    return (
        <Container className="py-4">
            <h2 className="mb-4">Fitness Tracker</h2>
            
            <Row>
                <Col lg={8} className="mb-4">
                    <Card className="shadow-sm">
                        <Card.Body>
                            <h4 className="mb-4">Quick Track</h4>
                            
                            {feedback.message && (
                                <Alert variant={feedback.type} dismissible 
                                       onClose={() => setFeedback({ type: '', message: '' })}>
                                    {feedback.message}
                                </Alert>
                            )}
                            
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Metric Type</Form.Label>
                                            <Form.Select
                                                value={metricData.metric_type}
                                                onChange={(e) => setMetricData({
                                                    ...metricData,
                                                    metric_type: e.target.value,
                                                    value: ''
                                                })}
                                                className="form-select-lg"
                                            >
                                                {metricTypes.map(type => (
                                                    <option key={type.value} value={type.value}>
                                                        {type.label}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>
                                                Value ({getCurrentMetricType().unit})
                                            </Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={metricData.value}
                                                onChange={(e) => setMetricData({
                                                    ...metricData,
                                                    value: e.target.value
                                                })}
                                                min={getCurrentMetricType().min}
                                                max={getCurrentMetricType().max}
                                                required
                                                className="form-control-lg"
                                                step={getCurrentMetricType().value === 'weight' ? '0.1' : '1'}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <div className="d-grid mt-3">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        disabled={loading}
                                        className="py-3"
                                    >
                                        {loading ? 'Tracking...' : 'Track Metric'}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>

                    <Row className="mt-4">
                        {metricTypes.map(type => (
                            <Col md={6} lg={4} key={type.value} className="mb-4">
                                <Card 
                                    className="h-100 shadow-sm" 
                                    style={{ borderLeft: `4px solid ${type.color}` }}
                                >
                                    <Card.Body>
                                        <div className="d-flex align-items-center mb-2">
                                            <type.icon size={24} color={type.color} />
                                            <h5 className="mb-0 ms-2">{type.label}</h5>
                                        </div>
                                        <p className="text-muted mb-2">Today&apos;s Progress</p>
                                        <h3 className="mb-0">
                                            {todayMetrics[type.value]?.toFixed(type.value === 'weight' ? 1 : 0) || '0'} 
                                            <small className="text-muted"> {type.unit}</small>
                                        </h3>
                                        <div 
                                            className="progress mt-2" 
                                            style={{ height: '8px' }}
                                        >
                                            <div
                                                className="progress-bar"
                                                role="progressbar"
                                                aria-label={`${type.label} progress`}
                                                aria-valuenow={todayMetrics[type.value] || 0}
                                                aria-valuemin={type.min}
                                                aria-valuemax={type.max}
                                                style={{
                                                    width: `${getProgressPercentage(
                                                        todayMetrics[type.value] || 0,
                                                        type.min,
                                                        type.max
                                                    )}%`,
                                                    backgroundColor: type.color
                                                }}
                                            />
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>

                <Col lg={4}>
                    <Card className="shadow-sm mb-4">
                        <Card.Body>
                            <h4 className="mb-4">Tips & Goals</h4>
                            <div className="mb-3">
                                <h5 className="d-flex align-items-center">
                                    {React.createElement(getCurrentMetricType().icon, {
                                        size: 20,
                                        color: getCurrentMetricType().color,
                                        className: "me-2"
                                    })}
                                    {getCurrentMetricType().label}
                                </h5>
                                <p className="text-muted">
                                    {getMetricTip(getCurrentMetricType().value)}
                                </p>
                            </div>
                            <Alert variant="info" className="mb-0">
                                <strong>Pro Tip:</strong> Track your metrics at the same time each day for more consistent data!
                            </Alert>
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm">
                        <Card.Body>
                            <h4 className="mb-4">Quick Stats</h4>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span>Today&apos;s Entries</span>
                                <span className="badge bg-primary">
                                    {Object.keys(todayMetrics).length}
                                </span>
                            </div>
                            <Alert variant="success" className="mb-0">
                                Keep up the great work! Regular tracking leads to better results.
                            </Alert>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default FitnessTracker; 