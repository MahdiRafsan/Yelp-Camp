import { api } from "../api/apiSlice";

const reviewApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query({
      query: ({ campgroundId, page }) =>
        `campgrounds/${campgroundId}/reviews?page=${page}&limit=6`,
      providesTags: ["Reviews"],
    }),
    getReviewById: builder.query({
      query: ({ campgroundId, reviewId }) =>
        `campgrounds/${campgroundId}/reviews/${reviewId}`,
      providesTags: ["Reviews"],
    }),
    addReview: builder.mutation({
      query: ({ campgroundId, review }) => ({
        url: `campgrounds/${campgroundId}/reviews`,
        method: "POST",
        body: review,
      }),
      invalidatesTags: ["Reviews"],
    }),
    updateReview: builder.mutation({
      query: ({ campgroundId, review }) => ({
        url: `campgrounds/${campgroundId}/reviews/${review._id}`,
        method: "PATCH",
        body: review,
      }),
      invalidatesTags: ["Reviews"],
    }),
    deleteReview: builder.mutation({
      query: ({ campgroundId, reviewId }) => ({
        url: `campgrounds/${campgroundId}/reviews/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reviews"],
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useGetReviewByIdQuery,
  useAddReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;
