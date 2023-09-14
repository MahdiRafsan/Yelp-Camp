import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Box,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Container,
  Avatar,
  Tooltip,
  Button,
  Typography,
  ListItemIcon,
  Divider,
} from "@mui/material";
import ForestIcon from "@mui/icons-material/Forest";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PowerSettingsNewOutlinedIcon from "@mui/icons-material/PowerSettingsNewOutlined";

import { StyledAppBar, StyledTypography } from "./Navbar.styles";
import { logout, selectUser } from "../../features/auth/authSlice";
const settings = [
  {
    title: "Profile",
    path: "profile",
    icon: <PermIdentityIcon fontSize="small" />,
  },
  {
    title: "Account",
    path: "password",
    icon: <SettingsOutlinedIcon fontSize="small" />,
  },
];

const Navbar = () => {
  const user = useSelector(selectUser);
  const theme = useTheme();
  const match = useMediaQuery(theme.breakpoints.down("sm"));

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth");
  };

  return (
    <>
      <StyledAppBar position="static" color="inherit">
        <Container maxWidth="xl">
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: match ? "space-between" : "space-around",
            }}
            disableGutters
          >
            <Box>
              <ForestIcon sx={{ color: "#fff" }} />
              <StyledTypography component={Link} to="/" variant="h5">
                Yelp-Camp
              </StyledTypography>
            </Box>

            {user ? (
              <Box>
                <StyledTypography component="span" variant="body2">
                  {user.fullName}
                </StyledTypography>
                <Tooltip title="Open Settings">
                  <IconButton onClick={handleOpenMenu}>
                    <Avatar
                      src={user?.profile_pic?.url}
                      alt={user.fullName[0]}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "50px" }}
                  id="appbar-menu"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  open={open}
                  onClose={handleCloseMenu}
                >
                  {settings.map((setting, index) => (
                    <MenuItem
                      sx={{ "&:hover": { color: "info.main" } }}
                      key={index}
                      component={Link}
                      to={setting.path}
                    >
                      <ListItemIcon sx={{ color: "inherit" }}>
                        {setting.icon}
                      </ListItemIcon>
                      <Typography>{setting.title}</Typography>
                    </MenuItem>
                  ))}
                  <Divider />
                  <MenuItem
                    sx={{ "&:hover": { color: "info.main" } }}
                    onClick={handleLogout}
                  >
                    <ListItemIcon sx={{ color: "inherit" }}>
                      <PowerSettingsNewOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography>Logout</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Box sx={{ display: "flex" }}>
                <Button
                  component={Link}
                  to="auth"
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: 2 }}
                  state={{ from: location }}
                >
                  Sign In
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </StyledAppBar>
    </>
  );
};
export default Navbar;
