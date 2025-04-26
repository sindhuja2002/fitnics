import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

// Common chart styles
const commonColors = {
    steps: {
        primary: 'rgb(75, 192, 192)',
        secondary: 'rgba(75, 192, 192, 0.2)'
    },
    calories: {
        primary: 'rgb(255, 99, 132)',
        secondary: 'rgba(255, 99, 132, 0.2)'
    },
    workout: {
        primary: 'rgb(54, 162, 235)',
        secondary: 'rgba(54, 162, 235, 0.6)'
    },
    health: {
        heartRate: {
            primary: 'rgb(255, 99, 132)',
            secondary: 'rgba(255, 99, 132, 0.7)'
        },
        weight: {
            primary: 'rgb(54, 162, 235)',
            secondary: 'rgba(54, 162, 235, 0.7)'
        },
        sleep: {
            primary: 'rgb(75, 192, 192)',
            secondary: 'rgba(75, 192, 192, 0.7)'
        }
    }
};

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:9000';

const Analytics = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`
                    }
                };
                const response = await axios.get(`${API_BASE_URL}/api/analytics/user/${userInfo._id}`, config);
                if (response.data.success) {
                    setAnalytics(response.data.data);
                } else {
                    setError(response.data.error || 'Failed to fetch analytics');
                }
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.error || err.message || 'Failed to fetch analytics');
                setLoading(false);
            }
        };

        if (userInfo) {
            fetchAnalytics();
        }
    }, [userInfo]);

    if (loading) return <div>Loading analytics...</div>;
    if (error) return <Alert variant="danger">Error: {error}</Alert>;
    if (!analytics) return <Alert variant="info">No analytics data available</Alert>;

    // Prepare data for charts
    const prepareChartData = (metricType) => {
        const filteredData = analytics.metrics
            .filter(m => m.metric_type === metricType)
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        // Get the last 30 days of data
        const last30Days = filteredData.slice(-30);

        return {
            labels: last30Days.map(m => {
                const date = new Date(m.timestamp);
                return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                });
            }),
            values: last30Days.map(m => m.value)
        };
    };

    // Steps Chart
    const stepsData = prepareChartData('steps');
    const stepsChartData = {
        labels: stepsData.labels,
        datasets: [
            {
                label: 'Daily Steps',
                data: stepsData.values,
                borderColor: commonColors.steps.primary,
                backgroundColor: commonColors.steps.secondary,
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: commonColors.steps.primary,
                pointBorderColor: '#fff',
                borderWidth: 2
            }
        ]
    };

    // Calories Chart
    const caloriesData = prepareChartData('calories_burned');
    const caloriesChartData = {
        labels: caloriesData.labels,
        datasets: [
            {
                label: 'Calories Burned',
                data: caloriesData.values,
                borderColor: commonColors.calories.primary,
                backgroundColor: commonColors.calories.secondary,
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: commonColors.calories.primary,
                pointBorderColor: '#fff',
                borderWidth: 2
            }
        ]
    };

    // Workout Duration Chart
    const workoutData = prepareChartData('workout_duration');
    const workoutChartData = {
        labels: workoutData.labels,
        datasets: [
            {
                label: 'Duration (minutes)',
                data: workoutData.values,
                backgroundColor: commonColors.workout.secondary,
                borderColor: commonColors.workout.primary,
                borderWidth: 1,
                borderRadius: 4,
                maxBarThickness: 40
            }
        ]
    };

    // Health Metrics Chart
    const healthMetricsData = {
        labels: [
            `Heart Rate: ${Math.round(analytics.metrics.filter(m => m.metric_type === 'heart_rate')
                .reduce((acc, curr) => acc + curr.value, 0) /
                Math.max(1, analytics.metrics.filter(m => m.metric_type === 'heart_rate').length))} bpm`,
            `Weight: ${Math.round(analytics.metrics.filter(m => m.metric_type === 'weight')
                .reduce((acc, curr) => acc + curr.value, 0) /
                Math.max(1, analytics.metrics.filter(m => m.metric_type === 'weight').length))} kg`,
            `Sleep: ${Math.round(analytics.metrics.filter(m => m.metric_type === 'sleep_duration')
                .reduce((acc, curr) => acc + curr.value, 0) /
                Math.max(1, analytics.metrics.filter(m => m.metric_type === 'sleep_duration').length))} hrs`
        ],
        datasets: [
            {
                data: [
                    analytics.metrics.filter(m => m.metric_type === 'heart_rate')
                        .reduce((acc, curr) => acc + curr.value, 0) /
                        Math.max(1, analytics.metrics.filter(m => m.metric_type === 'heart_rate').length),
                    analytics.metrics.filter(m => m.metric_type === 'weight')
                        .reduce((acc, curr) => acc + curr.value, 0) /
                        Math.max(1, analytics.metrics.filter(m => m.metric_type === 'weight').length),
                    analytics.metrics.filter(m => m.metric_type === 'sleep_duration')
                        .reduce((acc, curr) => acc + curr.value, 0) /
                        Math.max(1, analytics.metrics.filter(m => m.metric_type === 'sleep_duration').length)
                ],
                backgroundColor: [
                    commonColors.health.heartRate.secondary,
                    commonColors.health.weight.secondary,
                    commonColors.health.sleep.secondary
                ],
                borderColor: [
                    commonColors.health.heartRate.primary,
                    commonColors.health.weight.primary,
                    commonColors.health.sleep.primary
                ],
                borderWidth: 2,
                hoverOffset: 15
            }
        ]
    };

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 12,
                        weight: '500'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#333',
                bodyColor: '#666',
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 13 },
                padding: 12,
                borderColor: 'rgba(0, 0, 0, 0.1)',
                borderWidth: 1,
                displayColors: true,
                callbacks: {
                    label: function(context) {
                        const value = context.raw;
                        return ` ${value.toLocaleString()}`;
                    }
                }
            }
        }
    };

    const lineChartOptions = {
        ...commonOptions,
        plugins: {
            ...commonOptions.plugins,
            legend: {
                ...commonOptions.plugins.legend,
                position: 'top'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                    drawBorder: false
                },
                ticks: {
                    font: { size: 11 },
                    padding: 8,
                    callback: function(value) {
                        return value.toLocaleString();
                    }
                }
            },
            x: {
                grid: { display: false },
                ticks: {
                    font: { size: 11 },
                    maxRotation: 45,
                    minRotation: 45,
                    padding: 8
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    };

    const barChartOptions = {
        ...commonOptions,
        plugins: {
            ...commonOptions.plugins,
            legend: {
                ...commonOptions.plugins.legend,
                position: 'top'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                    drawBorder: false
                },
                ticks: {
                    font: { size: 11 },
                    padding: 8
                },
                title: {
                    display: true,
                    text: 'Minutes',
                    font: { size: 12, weight: '500' },
                    padding: { top: 10, bottom: 0 }
                }
            },
            x: {
                grid: { display: false },
                ticks: {
                    font: { size: 11 },
                    maxRotation: 45,
                    minRotation: 45,
                    padding: 8
                }
            }
        }
    };

    const doughnutOptions = {
        ...commonOptions,
        plugins: {
            ...commonOptions.plugins,
            legend: {
                position: 'right',
                labels: {
                    font: { size: 12, weight: '500' },
                    padding: 20,
                    usePointStyle: true
                },
                title: {
                    display: true,
                    text: 'Average Values',
                    font: { size: 14, weight: 'bold' },
                    padding: { bottom: 15 }
                }
            },
            tooltip: {
                ...commonOptions.plugins.tooltip,
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${Math.round(value)}`;
                    }
                }
            }
        },
        cutout: '75%'
    };

    return (
        <Container fluid className="px-4">
            <h2 className="mb-4 pt-3">Your Analytics Dashboard</h2>

            <Row className="mb-4 g-3">
                <Col lg={6}>
                    <Card className="shadow-sm h-100">
                        <Card.Body>
                            <h4 className="text-center mb-4">Daily Steps</h4>
                            <div style={{ height: '380px', position: 'relative' }}>
                                <Line data={stepsChartData} options={lineChartOptions} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={6}>
                    <Card className="shadow-sm h-100">
                        <Card.Body>
                            <h4 className="text-center mb-4">Calories Burned</h4>
                            <div style={{ height: '380px', position: 'relative' }}>
                                <Line data={caloriesChartData} options={lineChartOptions} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4 g-3">
                <Col lg={6}>
                    <Card className="shadow-sm h-100">
                        <Card.Body>
                            <h4 className="text-center mb-4">Workout Duration</h4>
                            <div style={{ height: '380px', position: 'relative' }}>
                                <Bar data={workoutChartData} options={barChartOptions} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={6}>
                    <Card className="shadow-sm h-100">
                        <Card.Body>
                            <h4 className="text-center mb-4">Health Metrics Overview</h4>
                            <div style={{ height: '380px', position: 'relative' }}>
                                <Doughnut data={healthMetricsData} options={doughnutOptions} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-light py-3">
                            <h4 className="mb-0">Summary</h4>
                        </Card.Header>
                        <Card.Body className="py-4">
                            <Row>
                                <Col md={4}>
                                    <div className="text-center">
                                        <h5 className="text-muted mb-3">Total Records</h5>
                                        <p className="h2 text-primary mb-0">{analytics.metrics.length}</p>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="text-center">
                                        <h5 className="text-muted mb-3">Tracked Metrics</h5>
                                        <p className="h2 text-success mb-0">
                                            {new Set(analytics.metrics.map(m => m.metric_type)).size}
                                        </p>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="text-center">
                                        <h5 className="text-muted mb-3">Latest Update</h5>
                                        <p className="h5 text-dark mb-0">
                                            {new Date(Math.max(...analytics.metrics.map(m => new Date(m.timestamp))))
                                                .toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                        </p>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Analytics;