import { useSelector } from "react-redux";
import { Grid, Paper, Typography } from "@mui/material";
import { useGetReviewsQuery } from "../../features/reviews/reviewApi";
import Review from "./Review";
import { selectUser } from "../../features/auth/authSlice";
const ReviewsSection = ({ campgroundId, setCurrentReviewId }) => {
  const user = useSelector(selectUser);
  const { data } = useGetReviewsQuery(campgroundId);

  return (
    <Paper elevation={3} sx={{ padding: "15px" }}>
      <Typography component="h1" variant="h3" gutterBottom>
        {data?.reviews.length ? "Reviews" : "No reviews yet"}
      </Typography>
      <Grid container spacing={2}>
        {data?.reviews.map((review) => {
          return (
            <Grid key={review._id} item xs={12} md={6} lg={6}>
              <Review
                campgroundId={campgroundId}
                review={review}
                setCurrentReviewId={setCurrentReviewId}
              />
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
};

export default ReviewsSection;
