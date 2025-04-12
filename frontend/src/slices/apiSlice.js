import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

// Create a baseQuery function that adds the Authorization header
const baseQuery = fetchBaseQuery({
	baseUrl: "http://localhost:9000",
	// baseUrl: "https://fitnics.vercel.app/",

	prepareHeaders: (headers, { getState }) => {
		// Get the token from the Redux state or localStorage
		const token =
			getState().auth.userInfo?.token || localStorage.getItem("token");

		// If a token exists, add it to the Authorization header
		if (token) {
			headers.set("Authorization", `Bearer ${token}`);
		}

		return headers;
	},
});

export const apiSlice = createApi({
	baseQuery, // Define the baseQuery
	tagTypes: ["User"], // Set tag types (if needed for invalidation)
	endpoints: (builder) => ({
		// Define your endpoints here (currently an empty object)
	}),
});

// This line will export hooks for the defined endpoints
// Since the endpoints object is currently empty, this will not export any hooks yet.
export default apiSlice;
