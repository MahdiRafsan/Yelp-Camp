import { useSearchParams } from "react-router-dom";

import { Grid, Paper, Typography, Box, CircularProgress } from "@mui/material";

import { useGetReviewsQuery } from "../../features/reviews/reviewApi";

import Pagination from "../Pagination/Pagination";
import Review from "./Review";

const ReviewsSection = ({
  reviewFormRef,
  campgroundId,
  setCurrentReviewId,
}) => {
  const [searchParams, setSearchParams] = useSearchParams({ page: 1 });
  const page = searchParams.get("page");

  const onPageChangeHandler = (event, newPage) => {
    setSearchParams({ page: newPage });
  };

  const { data, isLoading } = useGetReviewsQuery({ campgroundId, page });
  const { reviews, currentPage, totalPages, totalDocs } = data || {};

  return isLoading ? (
    <CircularProgress />
  ) : (
    <Paper elevation={3} sx={{ padding: "16px" }}>
      <Typography component="h2" variant="h4" gutterBottom>
        {totalDocs > 0 ? "Reviews" : "No reviews yet"}
      </Typography>
      <Grid container spacing={2}>
        {reviews.map((review) => {
          return (
            <Grid key={review._id} item xs={12} md={12} lg={12}>
              <Review
                reviewFormRef={reviewFormRef}
                campgroundId={campgroundId}
                review={review}
                setCurrentReviewId={setCurrentReviewId}
              />
            </Grid>
          );
        })}
      </Grid>
      {totalPages > 1 && (
        <Box m={2} display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={currentPage}
            onPageChange={onPageChangeHandler}
          />
        </Box>
      )}
    </Paper>
  );
};

export default ReviewsSection;
