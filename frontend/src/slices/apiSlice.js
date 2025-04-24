import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

// Create a baseQuery function that adds the Authorization header
const baseQuery = fetchBaseQuery({
	baseUrl: process.env.REACT_APP_API_URL || "http://localhost:9000",
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
	tagTypes: ["User", "Notifications", "Analytics"], // Set tag types (if needed for invalidation)
	endpoints: (builder) => ({
		// Notifications endpoints
		getNotificationSettings: builder.query({
			query: () => ({
				url: '/api/notifications/settings',
				method: 'GET',
			}),
			providesTags: ['Notifications'],
		}),
		updateNotificationSettings: builder.mutation({
			query: (settings) => ({
				url: '/api/notifications/settings',
				method: 'PUT',
				body: settings,
			}),
			invalidatesTags: ['Notifications'],
		}),
		sendTestNotification: builder.mutation({
			query: () => ({
				url: '/api/notifications/test',
				method: 'POST',
			}),
		}),
		// Analytics endpoints
		getUserAnalytics: builder.query({
			query: ({ userId, startDate }) => ({
				url: `/api/analytics/user/${userId}`,
				method: 'GET',
				params: { start_date: startDate },
			}),
			providesTags: ['Analytics'],
		}),
		trackMetric: builder.mutation({
			query: (data) => ({
				url: '/api/analytics/track',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['Analytics'],
		}),
	}),
});

// Export hooks for the defined endpoints
export const {
	useGetNotificationSettingsQuery,
	useUpdateNotificationSettingsMutation,
	useSendTestNotificationMutation,
	useGetUserAnalyticsQuery,
	useTrackMetricMutation,
} = apiSlice;

// This line will export hooks for the defined endpoints
// Since the endpoints object is currently empty, this will not export any hooks yet.
export default apiSlice;
