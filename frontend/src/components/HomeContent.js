import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import BannerImage from '../assets/images/image2.png';
import HeroBannerImage from "../assets/images/banner.png";

const HomeContent = () => {
  return (
      <Container
          className="my-5 py-4"
          style={{
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
      >
        {/* Header Section */}
        <Row className="mb-4 text-center">
          <Col>
            <h1 style={{ fontWeight: "700", color: "#1dda1d" }}>The Tools for Your Goals</h1>
            <p style={{ fontSize: "18px", color: "#555" }}>
              Trying to lose weight, tone up, lower your BMI, or invest in your
              overall health? We give you the right features to get there.
            </p>
          </Col>
        </Row>

        {/* Features Section */}
        <Row className="mb-4">
          <Col md={4}>
            <Card className="h-100 text-center" style={{ border: "none", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
              <Card.Body>
                <Card.Title style={{ fontWeight: "600", color: "#333" }}>Learn. Track. Improve.</Card.Title>
                <Card.Text style={{ color: "#666" }}>
                  Keeping a food diary helps you understand your habits and hit your goals.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 text-center" style={{ border: "none", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
              <Card.Body>
                <Card.Title style={{ fontWeight: "600", color: "#333" }}>Logging Simplified.</Card.Title>
                <Card.Text style={{ color: "#666" }}>
                  Save meals and use Quick Tools for fast and easy food tracking.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 text-center" style={{ border: "none", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
              <Card.Body>
                <Card.Title style={{ fontWeight: "600", color: "#333" }}>Stay Motivated.</Card.Title>
                <Card.Text style={{ color: "#666" }}>
                  Join the World&apos;s Largest Fitness Community for advice, tips, and support 24/7.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Call to Action Section */}
        <Row className="align-items-center">
          <Col md={6}>
            <h1 style={{ fontWeight: "700", color: "#1dda1d" }}>Start your fitness journey today!</h1>
            <p style={{ fontSize: "18px", color: "#555" }}>
              Sign up for Fitnics and get started on your path to a healthier lifestyle.
            </p>
              <Button
                  className="me-2"
                  as={Link}
                  to="/pages/register"
                  style={{
                      fontWeight: "600",
                      padding: "10px 20px",
                      borderRadius: "25px",
                      transition: "all 0.3s ease",
                      backgroundColor: "#1dda1d", // Custom green color
                      border: "none", // Remove border
                      color: "white", // Ensure text is readable
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#16b916")} // Darker shade on hover
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#1dda1d")} // Original color
              >
                  Register
              </Button>

              <Button
                variant="outline-primary"
                as={Link}
                to="/pages/login"
                style={{
                  fontWeight: "600",
                  padding: "10px 20px",
                  borderRadius: "25px",
                  transition: "all 0.3s ease",
                }}
            >
              Login
            </Button>
          </Col>
          <Col md={6}>
            <img
                src={BannerImage}
                alt="Banner"
                className="img-fluid"
                style={{ borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
            />
          </Col>
        </Row>
      </Container>
  );
};

export default HomeContent;
