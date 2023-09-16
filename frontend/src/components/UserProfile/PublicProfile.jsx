import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Campgrounds from "../Campgrounds/Campgrounds";
import {
  Box,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import CampgroundForm from "../CampgroundForm/CampgroundForm";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import ProfileSidebar from "./ProfileSidebar";
import ProfileHeader from "./ProfileHeader";
import { useGetUserByIdQuery } from "../../features/users/userAPI";
const PublicProfile = () => {
  const currentUser = useSelector(selectUser);
  const { userId } = useParams();
  const isCurrentUserLoggedIn = currentUser._id === userId;

  const { data, isLoading } = useGetUserByIdQuery(userId);
  const { user } = data || {};

  const [currentCampgroundId, setCurrentCampgroundId] = useState(null);
  const formRef = useRef(null);

  return isLoading ? (
    <CircularProgress />
  ) : (
    <Grid container spacing={3} justifyContent="center">
      {isCurrentUserLoggedIn && (
        <Grid item xs={12} sm={3}>
          <ProfileSidebar />
        </Grid>
      )}
      <Grid item xs={12} sm={6}>
        <Stack spacing={2}>
          <ProfileHeader user={user} />
          <Box>
            <Paper sx={{ p: "16px", mb: "16px" }}>
              <Typography component="h2" variant="h5">
                Campgrounds
              </Typography>
            </Paper>
            <Campgrounds
              formRef={formRef}
              setCurrentCampgroundId={setCurrentCampgroundId}
              userId={userId}
              isProfile
            />
          </Box>
        </Stack>
      </Grid>
      {isCurrentUserLoggedIn && (
        <Grid item xs={12} sm={3}>
          <CampgroundForm
            ref={formRef}
            currentCampgroundId={currentCampgroundId}
            setCurrentCampgroundId={setCurrentCampgroundId}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default PublicProfile;
