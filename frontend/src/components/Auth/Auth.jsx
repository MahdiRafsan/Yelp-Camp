import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import {
  Paper,
  Avatar,
  Container,
  Divider,
  Grid,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import InputField from "./InputField";
import { LoadingButton } from "@mui/lab";

import {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGoogleOAuthLoginMutation,
} from "../../features/auth/authAPI";
import { setCredentials } from "../../features/auth/authSlice";

import useToastMessages from "../../hooks/useToastMessages";
import GoogleLogin from "./GoogleLogin";

const Auth = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const showToast = useToastMessages();

  // url location with search params user came from
  const from =
    `${location.state?.from?.pathname}${location.state?.from?.search}` || "/";

  const initialState = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    usernameOrEmail: "",
    password: "",
    confirmPassword: "",
  };

  const [isSignUp, setIsSignUp] = useState(false); // toggle between signup and login forms
  const [showPassword, setShowPassword] = useState(false); // toggle password visibility
  const [formData, setFormData] = useState(initialState);

  const {
    firstName,
    lastName,
    username,
    email,
    usernameOrEmail,
    password,
    confirmPassword,
  } = formData;

  const handleShowPassword = () => setShowPassword((prevState) => !prevState);

  // reset everything upon switching between login and signup
  const switchSignUpMode = () => {
    setFormData(initialState);
    setIsSignUp((prevSignUp) => !prevSignUp);
    setShowPassword(false);
  };

  const [register, { isLoading: isRegisterLoading }] =
    useRegisterUserMutation();

  const [login, { isLoading: isLoginLoading }] = useLoginUserMutation();

  const [googleOAuthLogin, { isLoading: isGoogleLoading }] =
    useGoogleOAuthLoginMutation();

  const isLoading = isSignUp ? isRegisterLoading : isLoginLoading;

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onGoogleLoginHandler = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (res) => {
      const code = { code: res?.code };
      try {
        const response = await googleOAuthLogin(code).unwrap();
        const { message, userId, token, user } = response;
        dispatch(setCredentials({ userId, token, user }));
        showToast(message, "success");
        navigate(from, { replace: true });
      } catch (err) {
        showToast(err.data.message, "error");
      }
    },
    onError: (err) => console.log(err),
  });
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const signUpData = {
      firstName,
      lastName,
      username,
      email,
      password,
      confirmPassword,
    };
    const loginData = { usernameOrEmail, password };

    try {
      let response;
      if (isSignUp) {
        response = await register(signUpData).unwrap();
      } else {
        response = await login(loginData).unwrap();
      }

      const { message, userId, token, user } = response;
      dispatch(setCredentials({ userId, token, user }));
      showToast(message, "success");
      navigate(from, { replace: true });
    } catch (err) {
      showToast(err.data.message, "error");
    }
  };
  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: "32px" }}>
      <Paper sx={{ padding: "16px" }} elevation={0}>
        <Box display="flex" justifyContent="center" mt={2}>
          <Avatar variant="rounded" sx={{ mb: "16px", bgcolor: "#f73378" }}>
            <LockOutlinedIcon />
          </Avatar>
        </Box>
        <Typography component="h1" variant="h5" mb={2} align="center">
          {isSignUp ? "Create a new account" : "Log into your account"}
        </Typography>

        <form onSubmit={onSubmitHandler} noValidate>
          <Grid container spacing={2}>
            {isSignUp && (
              <>
                <InputField
                  name="firstName"
                  label="First Name"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={onChangeHandler}
                  autoFocus
                  half
                />
                <InputField
                  name="lastName"
                  label="Last Name"
                  type="text"
                  placeholder="Smith"
                  value={lastName}
                  onChange={onChangeHandler}
                  half
                />
                <InputField
                  name="username"
                  label="Username"
                  type="text"
                  placeholder="JohnSmith"
                  value={username}
                  onChange={onChangeHandler}
                  required
                />
                <InputField
                  name="email"
                  label="Enter your email"
                  type="email"
                  placeholder="user@user.com"
                  value={email}
                  onChange={onChangeHandler}
                  required
                />
              </>
            )}
            {!isSignUp && (
              <InputField
                name="usernameOrEmail"
                label="Enter your username or email"
                type="text"
                value={usernameOrEmail}
                onChange={onChangeHandler}
                autoFocus
                required
              />
            )}
            <InputField
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={onChangeHandler}
              handleShowPassword={handleShowPassword}
              required
            />
            {isSignUp && (
              <InputField
                name="confirmPassword"
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={onChangeHandler}
                handleShowPassword={handleShowPassword}
                required
              />
            )}
          </Grid>
          <LoadingButton
            loading={isLoading}
            loadingIndicator={isSignUp ? "Signing Up..." : "Logging In..."}
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ margin: "16px 0" }}
          >
            {isSignUp ? "Sign Up" : "Login "}
          </LoadingButton>
        </form>
        <Stack spacing={2}>
          <LoadingButton onClick={switchSignUpMode}>
            {isSignUp
              ? "Already have an account? Login"
              : "Need an account? Sign up here"}
          </LoadingButton>
          <Divider variant="fullWidth">
            <Typography component="small" variant="caption">
              or
            </Typography>
          </Divider>
          <GoogleLogin
            onGoogleLoginHandler={onGoogleLoginHandler}
            isLoading={isGoogleLoading}
          />
        </Stack>
      </Paper>
    </Container>
  );
};

export default Auth;
