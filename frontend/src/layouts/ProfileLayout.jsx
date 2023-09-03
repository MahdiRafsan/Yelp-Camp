import { Outlet } from "react-router-dom";
import ProfileSidebar from "../components/UserProfile/ProfileSidebar";
import ProfileHeader from "../components/UserProfile/ProfileHeader";
import { Grid, Stack } from "@mui/material";

const ProfileLayout = () => {
  return (
    <Grid container spacing={3} justifyContent='center'>
      <Grid item xs={12} sm={3}>
        <ProfileSidebar />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Stack spacing={2}>
          <ProfileHeader />
          <Outlet />
        </Stack>
      </Grid>
    </Grid>
  );
};

export default ProfileLayout;
