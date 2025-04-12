import React from "react";
import { ListGroup, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const API_BASE_URL = 'http://localhost:9000';

const ProfileSidebar = () => {
    const location = useLocation();
    const { userInfo } = useSelector((state) => state.auth);

    const isActive = (path) => location.pathname === path;

    const generateTestData = async () => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/analytics/generate-sample/${userInfo._id}`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`
                    },
                    params: { days: 30 }
                }
            );
            if (response.data.success) {
                alert('Test data generated successfully!');
            }
        } catch (error) {
            alert('Failed to generate test data: ' + (error.response?.data?.error || error.message));
        }
    };

    const sidebarLinks = [
        { path: "/pages/profile/update", label: "Update Profile" },
        { path: "/pages/profile/diet", label: "Update Diet Profile" },
        { path: "/pages/profile/meal-plan", label: "Meal Plan" },
        { path: "/pages/profile/water-intake", label: "Water Intake" },
        { path: "/pages/profile/fitness", label: "Fitness Tracker" },
        { path: "/pages/profile/analytics", label: "Analytics" },
        { path: "/pages/profile/notifications", label: "Notifications" }
    ];

    return (
        <div>
            <ListGroup className="mb-4">
                {sidebarLinks.map(({ path, label }) => (
                    <ListGroup.Item
                        as={Link}
                        to={path}
                        key={path}
                        active={false}
                        style={{
                            color: isActive(path) ? "#1dda1d" : "#333",
                            fontWeight: isActive(path) ? "bold" : "normal",
                            textDecoration: "none",
                            cursor: "pointer",
                            backgroundColor: isActive(path) ? "#f0fdf4" : "transparent",
                            border: "none",
                            padding: "12px 15px",
                            marginBottom: "5px",
                            borderRadius: "4px",
                            transition: "all 0.2s ease-in-out",
                            "&:hover": {
                                backgroundColor: "#f0fdf4",
                                color: "#1dda1d"
                            }
                        }}
                    >
                        {label}
                    </ListGroup.Item>
                ))}
            </ListGroup>
            
            <Button 
                variant="outline-success" 
                onClick={generateTestData}
                className="w-100"
                style={{
                    marginTop: "1rem",
                    padding: "10px",
                    borderRadius: "4px"
                }}
            >
                Generate Test Data
            </Button>
        </div>
    );
};

export default ProfileSidebar;
