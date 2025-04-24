import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:9000";

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({ 
        baseUrl,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (builder) => ({
        // ... existing endpoints ...

        // Notifications endpoints
        updateNotificationSettings: builder.mutation({
            query: (settings) => ({
                url: '/api/notifications/settings',
                method: 'PUT',
                body: settings
            })
        }),
        getNotificationSettings: builder.query({
            query: () => '/api/notifications/settings'
        }),
        sendTestNotification: builder.mutation({
            query: () => ({
                url: '/api/notifications/test',
                method: 'POST'
            })
        })
    })
});

export const {
    // ... existing exports ...
    useUpdateNotificationSettingsMutation,
    useGetNotificationSettingsQuery,
    useSendTestNotificationMutation
} = apiSlice; 