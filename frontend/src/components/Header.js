import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container, Navbar, Nav, NavDropdown, Button, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import { toast } from "react-toastify";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Logo from "../assets/images/FITNICS-cropped.jpg";

const Header = () => {
	const { userInfo } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [logoutApiCall] = useLogoutMutation();
	const location = useLocation();
	const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false); // Loader state

	const logoutHandler = async () => {
		setIsLoading(true); // Show loader on logout
		try {
			await logoutApiCall().unwrap();
			dispatch(logout());
			navigate("/");
			toast.success("Logout Successfully!");
		} catch (err) {
			toast.error("Failed to logout. Please try again.");
		} finally {
			setIsLoading(false); // Hide loader after operation
		}
	};

	const toggleMobileMenu = () => {
		setMobileMenuOpen(!isMobileMenuOpen);
	};

	const NavLink = ({ to, children }) => {
		const isActive = location.pathname === to;
		return (
			<Nav.Link
				as={Link}
				to={to}
				style={{
					padding: "10px 15px",
					borderRadius: "4px",
					backgroundColor: isActive ? "#1dda1d" : "transparent",
					color: isActive ? "white" : "#333",
					fontWeight: "500",
					transition: "background-color 0.3s ease",
					textAlign: "center",
				}}
				onMouseEnter={(e) => (e.target.style.backgroundColor = "#1dda1d")}
				onMouseLeave={(e) => {
					if (!isActive) e.target.style.backgroundColor = "transparent";
				}}
			>
				{children}
			</Nav.Link>
		);
	};

	return (
		<>
			<Navbar
				style={{
					backgroundColor: "#fff",
					boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Header shadow
					padding: "10px 20px",
					position: "sticky",
					top: 0,
					zIndex: 1000,
				}}
				expand="lg"
			>
				<Container style={{ maxWidth: "1200px" }}>
					<Navbar.Brand as={Link} to="/" style={{ display: "flex", alignItems: "center" }}>
						<img src={Logo} alt="Fitnics Logo" style={{ width: "150px", height: "auto" }} />
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={toggleMobileMenu}>
						{isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
					</Navbar.Toggle>
					<Navbar.Collapse id="responsive-navbar-nav">
						<Nav className="me-auto" style={{ display: "flex", gap: "10px" }}>
							<NavLink to="/">Home</NavLink>
							<NavLink to="/pages/features">Features</NavLink>
							<NavLink to="/pages/workouts">Workout Database</NavLink>
							<NavLink to="/pages/workoutplans">Workout Plans</NavLink>
							<NavLink to="/pages/nutrition-checker">Nutrition Checker</NavLink>
							<NavLink to="/pages/bmr-calculator">BMR</NavLink>
							<NavLink to="/pages/about">About</NavLink>
						</Nav>
						<Nav>
							{userInfo ? (
								<NavDropdown
									title={<span style={{ color: "#4ded2d", fontWeight: "500" }}>{userInfo.name}</span>}
									id="username"
									align="end"
									style={{ fontWeight: "500" }}
								>
									<NavDropdown.Item as={Link} to="/pages/profile">
										Profile
									</NavDropdown.Item>
									<NavDropdown.Divider />
									<NavDropdown.Item onClick={logoutHandler}>
										{isLoading ? (
											<Spinner animation="border" size="sm" style={{ marginRight: "5px" }} />
										) : (
											"Logout"
										)}
									</NavDropdown.Item>
								</NavDropdown>
							) : (
								<>
									<Nav.Link as={Link} to="/pages/register" style={{ fontWeight: "500" }}>
										Register
									</Nav.Link>
									<Nav.Link as={Link} to="/pages/login" style={{ fontWeight: "500" }}>
										Login
									</Nav.Link>
								</>
							)}
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
			{isLoading && (
				<div
					style={{
						position: "fixed",
						top: "0",
						left: "0",
						width: "100%",
						height: "100%",
						backgroundColor: "rgba(255, 255, 255, 0.8)",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						zIndex: 1100,
					}}
				>
					<Spinner animation="border" variant="primary" />
				</div>
			)}
		</>
	);
};

export default Header;
