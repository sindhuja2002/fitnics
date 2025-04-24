import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
	let token;

	// Log the incoming request headers for debugging
	console.log('Auth headers:', req.headers.authorization);

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			// Extract token
			token = req.headers.authorization.split(" ")[1];

			if (!token) {
				console.error('No token found in Authorization header');
				return res.status(401).json({
					success: false,
					error: "No token provided"
				});
			}

			if (!process.env.JWT_SECRET) {
				console.error('JWT_SECRET is not set');
				return res.status(500).json({
					success: false,
					error: "Server configuration error"
				});
			}

			// Verify token
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			console.log('Decoded token:', decoded);

			// Fetch user and attach to request
			const user = await User.findById(decoded._id).select("-password");
			
			if (!user) {
				console.error('User not found for token');
				return res.status(401).json({
					success: false,
					error: "User not found"
				});
			}

			req.user = user;
			next();
		} catch (error) {
			console.error('Token verification error:', error.message);
			return res.status(401).json({
				success: false,
				error: "Invalid token"
			});
		}
	} else {
		console.error('No Authorization header found');
		return res.status(401).json({
			success: false,
			error: "No authorization token provided"
		});
	}
};
