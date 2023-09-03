import { useState } from "react";
import {
  Paper,
  Typography,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import useToastMessages from "../../hooks/useToastMessages";

import { useUpdatePasswordMutation } from "../../features/users/userAPI";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
const PasswordForm = () => {
  const user = useSelector(selectUser);

  const initialValue = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const showToast = useToastMessages();
  const [updatePassword] = useUpdatePasswordMutation();
  const [formData, setFormData] = useState(initialValue);
  const [showPassword, setShowPassword] = useState(false);
  const { currentPassword, newPassword, confirmPassword } = formData;

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await updatePassword({
        passwordData: formData,
        id: user._id,
      }).unwrap();
      const { message } = response;
      showToast(message, "success");
    } catch (err) {
      showToast(err.data.message, "error");
    }
  };

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };
  return (
    <Paper elevation={4} sx={{ p: "16px", textAlign: "center" }}>
      <Typography component="h2" variant="h5">
        Account Info
      </Typography>
      <Typography component="h3" variant="body2" mb={3}>
        Change your password here
      </Typography>
      <form noValidate onSubmit={onSubmitHandler}>
        <Stack spacing={2}>
          <TextField
            autoFocus
            name="currentPassword"
            label="Current Password"
            type={showPassword ? "text" : "password"}
            value={currentPassword}
            onChange={onChangeHandler}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" onClick={handleShowPassword}>
                  <IconButton>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            name="newPassword"
            label="New Password"
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={onChangeHandler}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" onClick={handleShowPassword}>
                  <IconButton>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            name="confirmPassword"
            label="Confirm New Password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={onChangeHandler}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" onClick={handleShowPassword}>
                  <IconButton>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <LoadingButton variant="contained" fullWidth type="submit">
            Update Password
          </LoadingButton>
        </Stack>
      </form>
    </Paper>
  );
};

export default PasswordForm;
