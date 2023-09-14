import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Grid, Paper } from "@mui/material";
import CampgroundInfo from "../components/CampgroundInfo/CampgroundInfo";
import ReviewsSection from "../components/Reviews/ReviewsSection";
import MapBox from "../components/MapBox";
import ReviewsForm from "../components/Reviews/ReviewsForm";

const CampgroundDetailsPage = () => {
  const [currentReviewId, setCurrentReviewId] = useState(null);
  const { campgroundId } = useParams();

  const reviewFormRef = useRef(null);
  return (
    <Paper elevation={2} sx={{ padding: "15px" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <CampgroundInfo campgroundId={campgroundId} />
        </Grid>
        <Grid item xs={12} md={6}>
          <MapBox campgroundId={campgroundId} />
        </Grid>
        <Grid item xs={12} md={6}>
          <ReviewsSection
            reviewFormRef={reviewFormRef}
            campgroundId={campgroundId}
            setCurrentReviewId={setCurrentReviewId}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ReviewsForm
            ref={reviewFormRef}
            campgroundId={campgroundId}
            currentReviewId={currentReviewId}
            setCurrentReviewId={setCurrentReviewId}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CampgroundDetailsPage;
