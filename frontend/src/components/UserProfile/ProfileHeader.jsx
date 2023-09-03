import { Avatar, Paper, Typography, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";

const ProfileHeader = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const user = useSelector(selectUser)

  return (
    <>
      <Paper
        elevation={4}
        sx={{
          padding: "15px",
          // width: isSmall ? "100%" : "85%",
          // margin: "0 auto",
        }}
      >
        <Grid container spacing={2}>
          <Grid item>
            <Avatar
              src={user?.profile_pic?.url}
              alt={user.fullName}
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
              {user.username}
            </Typography>
            <Typography component="h2" variant="body1">
              {user.email}
            </Typography>
            <Typography component="p" variant="body2">
              {user.bio}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default ProfileHeader;
