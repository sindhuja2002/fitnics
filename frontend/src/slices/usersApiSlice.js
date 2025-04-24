import { logout } from "./authSlice"; // <-- Import logout action here
import { apiSlice } from "./apiSlice";

const USERS_URL = "/api/users";
const USER_STATUS_URL = "/api/user/status";
const USER_MEAL_PLAN_URL = "/api/user/meal-plan";
const USER_WATER_INTAKE_URL = "/api/users/water-intake";

export const userApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		// User endpoints
		login: builder.mutation({
			query: (data) => ({
				url: `${USERS_URL}/auth`,
				method: "POST",
				body: data,
			}),
			// Handle response and store token in the auth state
			onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
				try {
					const { data } = await queryFulfilled;
					// Assuming the response contains user data along with token
					if (data?.token) {
						dispatch(setCredentials(data)); // Store token and user info
					}
				} catch (err) {
					console.error("Login failed:", err);
				}
			},
		}),
		register: builder.mutation({
			query: (data) => ({
				url: `${USERS_URL}`,
				method: "POST",
				body: data,
			}),
		}),
		logout: builder.mutation({
			query: (data) => ({
				url: `${USERS_URL}/logout`,
				method: "POST",
				body: data,
			}),
			// Clear token on logout
			onQueryStarted: (arg, { dispatch }) => {
				dispatch(logout());
			},
		}),
		updateUser: builder.mutation({
			query: (data) => ({
				url: `${USERS_URL}/profile`,
				method: "PUT",
				body: data,
			}),
		}),
		// User status endpoints
		updateStatus: builder.mutation({
			query: (data) => ({
				url: `${USER_STATUS_URL}`,
				method: "PUT",
				body: data,
			}),
		}),

		// User meal plan endpoints
		createMealPlan: builder.mutation({
			query: (data) => ({
				url: `${USER_MEAL_PLAN_URL}`,
				method: "POST",
				body: data,
			}),
		}),
		updateMealPlan: builder.mutation({
			query: (data) => ({
				url: `${USER_MEAL_PLAN_URL}`,
				method: "PUT",
				body: data,
			}),
		}),

		// User Water intake endpoints
		createWaterIntake: builder.mutation({
			query: (data) => ({
				url: `${USER_WATER_INTAKE_URL}`,
				method: "POST",
				body: data,
			}),
		}),

		updateWaterIntake: builder.mutation({
			query: (data) => ({
				url: `${USER_WATER_INTAKE_URL}`,
				method: "PUT",
				body: data,
			}),
		}),
	}),
});

export const {
	useLoginMutation,
	useLogoutMutation,
	useRegisterMutation,
	useUpdateUserMutation,
	useUpdateStatusMutation,
	useCreateMealPlanMutation,
	useUpdateMealPlanMutation,
	useCreateWaterIntakeMutation,
	useUpdateWaterIntakeMutation,
} = userApiSlice;
