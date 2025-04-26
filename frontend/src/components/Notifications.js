import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { getServiceUrl } from '../helpers/urlHelpers';

const API_BASE_URL = getServiceUrl("backend")

const Notifications = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const [settings, setSettings] = useState({
        phone_number: '',
        enabled: true,
        reminder_times: [],
        notification_types: ['water', 'meal', 'workout']
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`
                    }
                };
                const response = await axios.get(`${API_BASE_URL}/api/notifications/settings/${userInfo._id}`, config);
                if (response.data.success) {
                    setSettings(response.data.data.settings);
                } else {
                    setError(response.data.error || 'Failed to fetch notification settings');
                }
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.error || err.message || 'Failed to fetch notification settings');
                setLoading(false);
            }
        };

        if (userInfo) {
            fetchSettings();
        }
    }, [userInfo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            };
            const response = await axios.post(`${API_BASE_URL}/api/notifications/settings`, {
                user_id: userInfo._id,
                ...settings
            }, config);
            if (response.data.success) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            } else {
                setError(response.data.error || 'Failed to update settings');
            }
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Failed to update settings');
        }
    };

    const handleTestNotification = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            };
            const response = await axios.post(`${API_BASE_URL}/api/notifications/test/${userInfo._id}`, {}, config);
            if (response.data.success) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            } else {
                setError(response.data.error || 'Failed to send test notification');
            }
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Failed to send test notification');
        }
    };

    if (loading) return <div>Loading notification settings...</div>;
    if (error) return <Alert variant="danger">Error: {error}</Alert>;

    return (
        <Container>
            <h2 className="mb-4">Notification Settings</h2>
            <Card>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="tel"
                                value={settings.phone_number}
                                onChange={(e) => setSettings({ ...settings, phone_number: e.target.value })}
                                placeholder="Enter phone number"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="switch"
                                id="notifications-enabled"
                                label="Enable Notifications"
                                checked={settings.enabled}
                                onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Notification Types</Form.Label>
                            {['water', 'meal', 'workout'].map((type) => (
                                <Form.Check
                                    key={type}
                                    type="checkbox"
                                    id={`notification-${type}`}
                                    label={type.charAt(0).toUpperCase() + type.slice(1)}
                                    checked={settings.notification_types.includes(type)}
                                    onChange={(e) => {
                                        const types = e.target.checked
                                            ? [...settings.notification_types, type]
                                            : settings.notification_types.filter(t => t !== type);
                                        setSettings({ ...settings, notification_types: types });
                                    }}
                                />
                            ))}
                        </Form.Group>

                        <Button variant="primary" type="submit" className="me-2">
                            Save Settings
                        </Button>
                        <Button variant="secondary" onClick={handleTestNotification}>
                            Send Test Notification
                        </Button>
                    </Form>

                    {success && (
                        <Alert variant="success" className="mt-3">
                            Settings updated successfully!
                        </Alert>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Notifications;