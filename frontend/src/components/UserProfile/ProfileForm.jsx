import { useState, useRef } from "react";
import { Paper, Typography, TextField, Grid } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import useToastMessages from "../../hooks/useToastMessages";

import { useUpdateUserMutation } from "../../features/users/userAPI";
import { setUpdatedUser, selectUser } from "../../features/auth/authSlice";
const ProfileForm = () => {
  const user = useSelector(selectUser);
  const initialState = {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    username: user.username || "",
    email: user.email || "",
    bio: user.bio || "",
    image: "",
  };

  const showToast = useToastMessages();
  const fileInputRef = useRef();
  const [formData, setFormData] = useState(initialState);
  const [updateUser] = useUpdateUserMutation();
  const dispatch = useDispatch();
  const { firstName, lastName, username, email, bio, image } = formData;

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onImageChangeHandler = (event) => {
    setFormData((prevData) => ({ ...prevData, image: event.target.files[0] }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const userData = new FormData();
    userData.append("firstName", firstName);
    userData.append("lastName", lastName);
    userData.append("username", username);
    userData.append("email", email);
    userData.append("bio", bio);
    userData.append("image", image);

    try {
      const response = await updateUser({
        user: userData,
        id: user._id,
      }).unwrap();
      const { message, updatedUser } = response;
      dispatch(setUpdatedUser({updatedUser}));
      showToast(message, "success");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.log(err);
      showToast(err.data.message, "error");
    }
  };

  return (
    <Paper elevation={4} sx={{ p: "16px", textAlign: "center" }}>
      <Typography component="h2" variant="h5">
        Public Profile
      </Typography>
      <Typography component="h3" variant="body2" mb={3}>
        Add information about yourself
      </Typography>
      <form encType="multipart/form-data" onSubmit={onSubmitHandler}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="username"
              label="Username"
              type="text"
              placeholder="user123"
              value={username}
              onChange={onChangeHandler}
              fullWidth
              autoFocus
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="email"
              label="Email"
              type="email"
              placeholder="user@user.com"
              value={email}
              onChange={onChangeHandler}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="firstName"
              label="First Name"
              type="text"
              placeholder="John"
              value={firstName}
              onChange={onChangeHandler}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="lastName"
              label="Last Name"
              type="text"
              placeholder="Doe"
              value={lastName}
              onChange={onChangeHandler}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name=""
              label="Profile Picture"
              type="file"
              inputRef={fileInputRef}
              InputLabelProps={{ shrink: true }}
              onChange={onImageChangeHandler}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="bio"
              label="Bio"
              type="text"
              multiline
              rows={4}
              placeholder="Avid traveller"
              value={bio}
              onChange={onChangeHandler}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} m="auto">
            <LoadingButton variant="contained" type="submit">
              Update Profile
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ProfileForm;
