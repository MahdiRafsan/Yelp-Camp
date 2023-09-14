import { forwardRef, useEffect, useState } from "react";
import { Paper, Typography, Stack, Rating, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  useGetReviewByIdQuery,
  useAddReviewMutation,
  useUpdateReviewMutation,
} from "../../features/reviews/reviewApi";
import useToastMessages from "../../hooks/useToastMessages";

const ReviewsForm = forwardRef((props, ref) => {
  const { campgroundId, currentReviewId, setCurrentReviewId } = props
  const showToast = useToastMessages();
  const { data: reviewData } = useGetReviewByIdQuery({
    campgroundId,
    reviewId: currentReviewId,
  });
  const [addReview] = useAddReviewMutation();
  const [updateReview] = useUpdateReviewMutation();

  const initialState = {
    rating: "",
    description: "",
  };

  const [formData, setFormData] = useState(initialState);
  const { rating, description } = formData;

  useEffect(() => {
    if (reviewData) {
      setFormData({
        rating: reviewData?.review?.rating || "",
        description: reviewData?.review?.description || "",
      });
    }
  }, [reviewData]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const clearFormHandler = () => {
    setCurrentReviewId(0);
    setFormData(initialState);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const review = formData;
      const data = { ...review, _id: currentReviewId };
      const response = currentReviewId
        ? await updateReview({ campgroundId, review: data }).unwrap()
        : await addReview({ campgroundId, review }).unwrap();
      const { message } = response;
      showToast(message, "success");
      clearFormHandler();
    } catch (err) {
      showToast(err.data.message, "error");
    }
  };

  return (
    <Paper ref={ref} elevation={6} sx={{ padding: "16px" }}>
      <Typography component="h2" variant="h4" mb={2}>
        {currentReviewId ? "Edit" : "Add"} a review
      </Typography>
      <form onSubmit={onSubmitHandler} noValidate>
        <Stack spacing={2}>
          <Typography component="label" variant="h6">
            Overall Rating
          </Typography>
          <Rating
            name="rating"
            label="rating"
            value={rating}
            onChange={onChangeHandler}
          />
          <TextField
            name="description"
            label="Your review"
            type="text"
            multiline
            rows={4}
            value={description}
            onChange={onChangeHandler}
            placeholder="Add your review"
            required
            fullWidth
          />
          <LoadingButton
            variant="contained"
            size="small"
            color="error"
            onClick={clearFormHandler}
          >
            Clear
          </LoadingButton>
          <LoadingButton type="submit" variant="contained" size="small">
            Submit
          </LoadingButton>
        </Stack>
      </form>
    </Paper>
  );
});

export default ReviewsForm;
