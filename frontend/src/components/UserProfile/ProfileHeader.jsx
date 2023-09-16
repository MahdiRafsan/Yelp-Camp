import { Avatar, Paper, Typography, Grid } from "@mui/material";

const ProfileHeader = ({ user }) => {
  return (
    <Paper elevation={6} sx={{ padding: "16px" }}>
      <Grid container spacing={2}>
        <Grid item>
          <Avatar
            src={user?.profile_pic?.url}
            alt={user?.fullName}
            sx={{ width: "150px", height: "150px" }}
          ></Avatar>
        </Grid>
        <Grid
          item
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography component="h1" variant="h4">
            {user?.username}
          </Typography>
          <Typography component="h2" variant="body1">
            {user?.email}
          </Typography>
          <Typography
            component="p"
            variant="body2"
            sx={{ wordWrap: "break-word" }}
          >
            {user?.bio}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ProfileHeader;
