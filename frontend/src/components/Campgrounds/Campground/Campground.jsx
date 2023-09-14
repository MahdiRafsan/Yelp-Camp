import {
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  CardActions,
  Typography,
  CircularProgress,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { useDeleteCampgroundMutation } from "../../../features/campgrounds/campgroundApi";
import useToastMessages from "../../../hooks/useToastMessages";
import { selectUser } from "../../../features/auth/authSlice";

const Campground = ({ formRef, campground, setCurrentCampgroundId }) => {
  const user = useSelector(selectUser);

  const showToast = useToastMessages();
  const navigate = useNavigate();
  const [deleteCampground, { isLoading }] = useDeleteCampgroundMutation();

  const onEditHandler = async () => {
    setCurrentCampgroundId(campground._id);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const onDeleteHandler = async (e) => {
    try {
      const response = await deleteCampground(campground._id).unwrap();
      const { message } = response;
      showToast(message, "success");
    } catch (err) {
      showToast(err.data.message, "error");
    }
  };
  return isLoading ? (
    <CircularProgress color="success" />
  ) : (
    <Card
      sx={{
        minWidth: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardActionArea
        onClick={() => navigate(`/campgrounds/${campground._id}`)}
      >
        <CardMedia
          height="200px"
          component="img"
          image={campground?.images[0]?.url}
          alt={`${campground.title} Campground`}
        />
        <CardContent>
          <Typography variant="h5" component="div">
            {campground.title}
          </Typography>
          <Typography variant="body2" component="p" color="text.secondary">
            {campground.description.substring(0, 100)}...
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        {user?._id === campground.author._id && (
          <>
            <LoadingButton
              variant="contained"
              size="small"
              color="primary"
              startIcon={<EditIcon />}
              onClick={onEditHandler}
            >
              Edit
            </LoadingButton>
            <LoadingButton
              variant="contained"
              size="small"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={onDeleteHandler}
            >
              Delete
            </LoadingButton>
          </>
        )}
      </CardActions>
    </Card>
  );
};

export default Campground;
