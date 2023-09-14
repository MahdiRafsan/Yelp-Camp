import { api } from "../api/apiSlice";

const campgroundApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCampgrounds: builder.query({
      query: ({ page }) => `campgrounds?page=${page}&limit=6`,
      providesTags: ["Campgrounds"],
    }),
    getCampgroundById: builder.query({
      query: (id) => `campgrounds/${id}`,
      providesTags: ["Campgrounds"],
    }),
    addCampground: builder.mutation({
      query: (campground) => ({
        url: "campgrounds",
        method: "POST",
        body: campground,
      }),
      invalidatesTags: ["Campgrounds"],
    }),
    updateCampground: builder.mutation({
      query: ({ campground, campgroundId }) => ({
        url: `campgrounds/${campgroundId}`,
        method: "PATCH",
        body: campground,
      }),
      invalidatesTags: ["Campgrounds"],
    }),
    deleteCampground: builder.mutation({
      query: (id) => ({
        url: `campgrounds/${id}`,
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: ["Campgrounds"],
    }),
  }),
});

export const {
  useGetCampgroundsQuery,
  useGetCampgroundByIdQuery,
  useAddCampgroundMutation,
  useUpdateCampgroundMutation,
  useDeleteCampgroundMutation,
} = campgroundApi;
