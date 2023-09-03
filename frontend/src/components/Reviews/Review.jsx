import moment from "moment";

import { Box, Avatar, Typography, Rating, Divider, Grid } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { LoadingButton } from "@mui/lab";

import { useDeleteReviewMutation } from "../../features/reviews/reviewApi";
import useToastMessages from "../../hooks/useToastMessages";

import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
const Review = ({ campgroundId, review, setCurrentReviewId }) => {
  const user = useSelector(selectUser);
  const showToast = useToastMessages();

  const [deleteReview] = useDeleteReviewMutation();

  const onEditHandler = () => {
    setCurrentReviewId(review._id);
  };

  const onDeleteHandler = async () => {
    try {
      const reviewId = review._id;
      const response = await deleteReview({ campgroundId, reviewId }).unwrap();
      const { message } = response;
      showToast(message, "success");
    } catch (err) {
      showToast(err.data.message, "error");
    }
  };
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Avatar
          sx={{ marginRight: "15px" }}
          src={review?.author?.profile_pic?.url}
          alt={review?.author?.username}
        />
        <Typography component="h2" variant="body1" gutterBottom>
          {review.author.username}
        </Typography>
      </Box>
      <Rating value={review.rating} readOnly sx={{ marginTop: "10px" }} />
      <Typography
        component="p"
        variant="body2"
        color="textSecondary"
        gutterBottom
      >
        {`Reviewed on ${moment(review.createdAt).format("MMMM Do, YYYY")}`}
      </Typography>
      <Typography sx={{ margin: "15px 0" }} gutterBottom>
        {review.description}
      </Typography>
      {user._id === review.author._id && (
        <Grid container spacing={1}>
          <Grid item>
            <LoadingButton
              variant="contained"
              size="small"
              color="primary"
              startIcon={<EditIcon />}
              onClick={onEditHandler}
            >
              Edit
            </LoadingButton>
          </Grid>
          <Grid item>
            <LoadingButton
              variant="contained"
              size="small"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={onDeleteHandler}
            >
              Delete
            </LoadingButton>
          </Grid>
        </Grid>
      )}
      <Divider sx={{ margin: "20px 0" }} />
    </>
  );
};

export default Review;
