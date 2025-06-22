import { apiSlice } from './apiSlice';

const notificationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => '/my-notifications',
    }),
  }),
});

export const { useGetNotificationsQuery } = notificationsApi;
