import {
  Avatar,
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PasswordIcon from "@mui/icons-material/Password";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser, selectUserId } from "../../features/auth/authSlice";

const ProfileSidebar = () => {
  const user = useSelector(selectUser);
  const userId = useSelector(selectUserId);
  const location = useLocation();

  // not displaying account link for google oauth users
  const sidebarData = [
    {
      title: "View Public Profile",
      path: `/profile/${userId}`,
      icon: <PeopleIcon />,
    },
    {
      title: "Profile",
      path: "/profile",
      icon: <AccountCircleIcon />,
    },
    !user.oAuthId && {
      title: "Account Security",
      path: "/password",
      icon: <PasswordIcon />,
    },
    {
      title: "Delete Account",
      path: "/delete",
      icon: <PersonRemoveIcon />,
    },
  ].filter(Boolean);

  return (
    <Paper sx={{ pt: "24px" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: "16px",
        }}
      >
        <Avatar
          src={user?.profile_pic?.url}
          sx={{ width: "100px", height: "100px", mb: "16px" }}
          alt={user?.fullName}
        />
        <Typography component="h4" variant="h5">
          {user.fullName}
        </Typography>
      </Box>
      <Divider sx={{ m: "30px 0" }} />
      <List sx={{ mt: "auto" }}>
        {sidebarData.map((element, index) => {
          return (
            <div key={index}>
              <ListItem disablePadding>
                <ListItemButton
                  component={NavLink}
                  to={element.path}
                  selected={location.pathname === element.path}
                >
                  <ListItemIcon>{element.icon}</ListItemIcon>
                  <ListItemText primary={element.title} />
                </ListItemButton>
              </ListItem>
              <Divider />
            </div>
          );
        })}
      </List>
    </Paper>
  );
};

export default ProfileSidebar;
