import React, { useState, useEffect } from 'react';
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useUpdateUserMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import Loader from "./Loader";

const UpdateProfile = ({ userInfo, dispatch }) => {
    const [name, setName] = useState(userInfo.name || "");
    const [email, setEmail] = useState(userInfo.email || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [updateProfile, { isLoading }] = useUpdateUserMutation();

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password && password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        try {
            const res = await updateProfile({
                _id: userInfo._id,
                name,
                email,
                password,
            }).unwrap();
            dispatch(setCredentials({ ...res }));
            toast.success("Profile Updated!");
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <Form
            onSubmit={submitHandler}
            style={{
                maxWidth: "400px",
                margin: "auto",
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                backgroundColor: "#f8f9fa",
            }}
        >
            <h2 className="text-center mb-4" style={{ color: "#1dda1d" }}>
                Update Profile
            </h2>

            <Form.Group className="mb-3" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                        padding: "10px",
                        fontSize: "16px",
                        borderRadius: "5px",
                        border: "1px solid #ddd",
                    }}
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        padding: "10px",
                        fontSize: "16px",
                        borderRadius: "5px",
                        border: "1px solid #ddd",
                    }}
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Enter Password (optional)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        padding: "10px",
                        fontSize: "16px",
                        borderRadius: "5px",
                        border: "1px solid #ddd",
                    }}
                />
            </Form.Group>

            <Form.Group className="mb-4" controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Confirm Password (optional)"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                        padding: "10px",
                        fontSize: "16px",
                        borderRadius: "5px",
                        border: "1px solid #ddd",
                    }}
                />
            </Form.Group>

            {isLoading && (
                <div className="text-center mb-3">
                    <Loader />
                </div>
            )}

            <Button
                type="submit"
                variant="success"
                style={{
                    width: "100%",
                    padding: "10px",
                    fontSize: "16px",
                    fontWeight: "600",
                    borderRadius: "5px",
                    backgroundColor: "#1dda1d",
                    border: "none",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#16b916")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#1dda1d")}
            >
                Update
            </Button>
        </Form>
    );
};

export default UpdateProfile;
