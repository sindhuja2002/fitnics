import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col } from "react-bootstrap";
import { Route, Routes, useLocation, Link } from "react-router-dom";
import { setCredentials } from "../slices/authSlice";
import ProfileSidebar from "../components/ProfileSidebar";
import UpdateProfile from "../components/UpdateProfile";
import UpdateDietProfile from "../components/UpdateDietProfile";
import MealPlan from "../components/MealPlan";
import WaterIntake from "../components/WaterIntake";
import Analytics from "../components/Analytics.jsx";
import Notifications from "../components/Notifications";
import FitnessTracker from "../components/FitnessTracker";

const Profile = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);
    const location = useLocation();

    useEffect(() => {
        if (userInfo) {
            dispatch(setCredentials(userInfo));
        }
    }, [userInfo, dispatch]);

    const getActiveStyle = (path) => {
        return location.pathname.includes(path)
            ? { color: "#1dda1d", fontWeight: "bold" }
            : { color: "#333" };
    };

    const sidebarLinks = [
        { path: "/profile/", text: "Update Profile" },
        { path: "/profile/diet", text: "Update Diet Profile" },
        { path: "/profile/meal-plan", text: "Meal Plan" },
        { path: "/profile/water-intake", text: "Water Intake" },
        { path: "/profile/fitness", text: "Fitness Tracker" },
        { path: "/profile/analytics", text: "Analytics" },
        { path: "/profile/notifications", text: "Notifications" }
    ];

    return (
        <Row className="g-4" style={{ padding: "20px", minHeight: "80vh" }}>
            <Col
                md={3}
                className="d-none d-md-block"
                style={{
                    borderRight: "1px solid #ddd",
                    paddingRight: "20px",
                }}
            >
                <ProfileSidebar>
                    <ul style={{ listStyleType: "none", padding: "0" }}>
                        {sidebarLinks.map((link, index) => (
                            <li key={index}>
                                <Link
                                    to={link.path}
                                    style={{
                                        textDecoration: "none",
                                        padding: "10px",
                                        display: "block",
                                        ...getActiveStyle(link.path),
                                    }}
                                >
                                    {link.text}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </ProfileSidebar>
            </Col>
            <Col xs={12} md={9}>
                <Routes>
                    <Route path="/" element={<UpdateProfile userInfo={userInfo} />} />
                    <Route path="update" element={<UpdateProfile userInfo={userInfo} />} />
                    <Route path="diet" element={<UpdateDietProfile />} />
                    <Route path="meal-plan" element={<MealPlan />} />
                    <Route path="water-intake" element={<WaterIntake />} />
                    <Route path="fitness" element={<FitnessTracker />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="notifications" element={<Notifications />} />
                </Routes>
            </Col>
        </Row>
    );
};

export default Profile;
