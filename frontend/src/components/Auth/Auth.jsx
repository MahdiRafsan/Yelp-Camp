import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Avatar, Container, Grid, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import InputField from "./InputField";
import { StyledPaper, Form, StyledButton } from "./Auth.styles";

import {
  useRegisterUserMutation,
  useLoginUserMutation,
} from "../../features/auth/authAPI";
import { setCredentials } from "../../features/auth/authSlice";

import useToastMessages from "../../hooks/useToastMessages";

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showToast = useToastMessages();

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
  const isLoading = isSignUp ? isRegisterLoading : isLoginLoading;

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
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
      navigate("/");
    } catch (err) {
      showToast(err.data.message, "error");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <StyledPaper elevation={0}>
        <Avatar variant="rounded" sx={{ mb: "5px", bgcolor: "#f73378" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {isSignUp ? "Create a new account" : "Log into your account"}
        </Typography>
        <Form onSubmit={onSubmitHandler} noValidate>
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
          <StyledButton
            loading={isLoading}
            loadingIndicator="Loading..."
            type="submit"
            variant="contained"
            color="primary"
          >
            {isSignUp ? "Sign Up" : "Login "}
          </StyledButton>
        </Form>
        <StyledButton onClick={switchSignUpMode}>
          {isSignUp
            ? "Already have an account? Login"
            : "Need an account? Sign up here"}
        </StyledButton>
      </StyledPaper>
    </Container>
  );
};

export default Auth;
