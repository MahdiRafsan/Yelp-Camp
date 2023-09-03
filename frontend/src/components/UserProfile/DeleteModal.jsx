import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Modal,
  Paper,
  Typography,
  Divider,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDeleteUserMutation } from "../../features/users/userAPI";
import useToastMessages from "../../hooks/useToastMessages";

const DeleteModal = ({ onModalOpen, onModalClose, onDelete }) => {
  // styles
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  const closeIconStyle = {
    ":hover": {
      cursor: "pointer",
      transform: "scale(1.1)",
      transition: "transform 0.3s ease-in-out",
    },
  };

  return (
    <Modal open={onModalOpen} onClose={onModalClose}>
      <Paper sx={modalStyle}>
        <Stack spacing={2}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography component="h2" variant="h5">
              Are you sure?
            </Typography>
            <CloseIcon onClick={onModalClose} sx={closeIconStyle} />
          </Box>
          <Divider />
          <Box>
            <Typography component="p" variant="body1">
              This action cannot be undone. Are you sure you want to continue?
            </Typography>
          </Box>
          <Divider />
          <Box>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={onModalClose}
              >
                Cancel
              </Button>
              <Button variant="contained" color="error" onClick={onDelete}>
                Delete
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Modal>
  );
};

export default DeleteModal;
