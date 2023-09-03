import { styled } from "@mui/material/styles";
import { createTheme, Paper } from "@mui/material";
import { LoadingButton } from "@mui/lab";

const theme = createTheme();
export const StyledPaper = styled(Paper)({
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  opacity: ".8",
});

export const Form = styled("form")({
  marginTop: theme.spacing(2),
});

export const StyledButton = styled(LoadingButton)({
  width: "100%",
  marginTop: theme.spacing(2),
});
