import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";

export const StyledAppBar = styled(AppBar)({
  borderRadius: 20,
  margin: "15px 0",
  padding: "10px 50px",
  backgroundColor: "transparent",
  boxShadow: "none",
  minWidth: "400px",
});

export const StyledTypography = styled(Typography)({
  m: 2,
  fontFamily: "Roboto",
  fontWeight: 700,
  letterSpacing: ".1rem",
  color: "#fff",
  textDecoration: "none",
});
