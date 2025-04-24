import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import { useGetNotificationSettingsQuery, useUpdateNotificationSettingsMutation, useSendTestNotificationMutation } from '../slices/apiSlice';

const Notifications = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const [settings, setSettings] = useState({
        phone_number: '',
        enabled: true,
        reminder_times: [],
        notification_types: ['water', 'meal', 'workout']
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const { data: settingsData, isLoading, error: fetchError } = useGetNotificationSettingsQuery();
    const [updateSettings] = useUpdateNotificationSettingsMutation();
    const [sendTestNotification] = useSendTestNotificationMutation();

    useEffect(() => {
        if (settingsData?.success) {
            setSettings(settingsData.data.settings);
        }
    }, [settingsData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await updateSettings(settings).unwrap();
            if (response.success) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            } else {
                setError(response.error || 'Failed to update settings');
            }
        } catch (err) {
            setError(err.data?.error || err.message || 'Failed to update settings');
        }
    };

    const handleTestNotification = async () => {
        try {
            const response = await sendTestNotification().unwrap();
            if (response.success) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            } else {
                setError(response.error || 'Failed to send test notification');
            }
        } catch (err) {
            setError(err.data?.error || err.message || 'Failed to send test notification');
        }
    };

    if (isLoading) return <div>Loading notification settings...</div>;
    if (fetchError) return <Alert variant="danger">Error: {fetchError.data?.error || fetchError.message}</Alert>;

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
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="switch"
                                id="enabled-switch"
                                label="Enable Notifications"
                                checked={settings.enabled}
                                onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Notification Types</Form.Label>
                            <div>
                                {['water', 'meal', 'workout'].map((type) => (
                                    <Form.Check
                                        key={type}
                                        type="checkbox"
                                        id={`type-${type}`}
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
                            </div>
                        </Form.Group>

                        <Button variant="primary" type="submit" className="me-2">
                            Save Settings
                        </Button>
                        <Button variant="secondary" onClick={handleTestNotification}>
                            Send Test Notification
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            {success && <Alert variant="success" className="mt-3">Operation successful!</Alert>}
            {error && <Alert variant="danger" className="mt-3">Error: {error}</Alert>}
        </Container>
    );
};

export default Notifications; 