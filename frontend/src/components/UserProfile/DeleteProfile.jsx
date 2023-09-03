import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Paper, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteModal from "./DeleteModal";
import { useDeleteUserMutation } from "../../features/users/userAPI";
import useToastMessages from "../../hooks/useToastMessages";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";

const DeleteProfile = () => {
  const user = useSelector(selectUser);

  const navigate = useNavigate();
  const showToast = useToastMessages();
  const [deleteUser] = useDeleteUserMutation();

  const onDeleteHandler = async () => {
    try {
      const response = await deleteUser(user._id).unwrap();
      const { message } = response;
      showToast(message, "success");
      setTimeout(() => {
        navigate("/auth");
      }, 1);
    } catch (err) {
      showToast(err.data.message, "error");
    }
  };

  const [modalOpen, setModalOpen] = useState(false);
  const modalOpenHandler = () => setModalOpen(true);
  const modalCloseHandler = () => setModalOpen(false);
  return (
    <Paper elevation={4} sx={{ p: "16px" }}>
      <Box textAlign="center">
        <Typography component="h2" variant="h5">
          Delete Your Profile
        </Typography>
        <Typography component="h3" variant="body2" mb={3}>
          Delete or Close your account permanently
        </Typography>
      </Box>
      <Typography component="h4" variant="h5" color="warning.main">
        Warning
      </Typography>
      <Typography component="p" variant="body1" mb={3}>
        If you close your account, you won't be able to retrieve the content or
        information you have shared on Yelp-Camp. All your posts, images,
        reviews and data associated with your account will be permanently
        deleted.
      </Typography>
      <Button
        variant="contained"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={modalOpenHandler}
      >
        Delete My Account
      </Button>
      <DeleteModal
        onModalOpen={modalOpen}
        onModalClose={modalCloseHandler}
        onDelete={onDeleteHandler}
      />
    </Paper>
  );
};

export default DeleteProfile;
