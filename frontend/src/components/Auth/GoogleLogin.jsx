import { Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import GoogleIcon from "@mui/icons-material/Google";

const GoogleLogin = ({ onGoogleLoginHandler, isLoading }) => {
  return (
    <LoadingButton
      loading={isLoading}
      loadingIndicator="Signing in..."
      variant="contained"
      fullWidth
      startIcon={<GoogleIcon />}
      onClick={onGoogleLoginHandler}
      sx={{ mt: "16px" }}
    >
      Sign in with Google
    </LoadingButton>
  );
};

export default GoogleLogin;
