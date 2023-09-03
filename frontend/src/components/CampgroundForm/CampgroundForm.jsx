import { useState, useEffect, useRef, forwardRef } from "react";
import {
  Stack,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  ImageList,
  ImageListItem,
  Checkbox,
  ImageListItemBar,
  IconButton,
  FormControlLabel,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import {
  useGetCampgroundByIdQuery,
  useAddCampgroundMutation,
  useUpdateCampgroundMutation,
} from "../../features/campgrounds/campgroundApi";
import useToastMessages from "../../hooks/useToastMessages";
const CampgroundForm = forwardRef((props, ref) => {
  const { currentCampgroundId, setCurrentCampgroundId } = props;
  
  const showToast = useToastMessages();
  const fileInputRef = useRef();

  const { data } = useGetCampgroundByIdQuery(currentCampgroundId);
  const [addCampground] = useAddCampgroundMutation();
  const [updateCampground] = useUpdateCampgroundMutation();

  const initialState = {
    title: "",
    price: "",
    description: "",
    location: "",
    images: [], // to send image (FileList) to backend
    databaseImages: [], // to contain image (urls, cloudinary_id) from databse
    deletedImages: [],
  };

  const [formData, setFormData] = useState(initialState);
  const {
    title,
    price,
    description,
    location,
    images,
    databaseImages,
    deletedImages,
  } = formData;

  useEffect(() => {
    if (data) {
      setFormData({
        title: data?.campground?.title || "",
        price: data?.campground?.price || "",
        description: data?.campground?.description || "",
        location: data?.campground?.location || "",
        images: [],
        databaseImages: data?.campground?.images || [],
        deletedImages: [],
      });
    }
  }, [data]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onImageChangeHandler = (event) => {
    setFormData((prevData) => ({ ...prevData, images: event.target.files }));
  };

  const onImageDeleteHandler = (e) => {
    const { checked, value } = e.target;
    if (checked) {
      setFormData((prevData) => ({
        ...prevData,
        deletedImages: [...deletedImages, value],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        deletedImages: deletedImages.filter((image) => image !== value),
      }));
    }
  };

  const clearFormHandler = () => {
    setCurrentCampgroundId(null);
    setFormData(initialState);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const campgroundData = new FormData();
    campgroundData.append("title", title);
    campgroundData.append("price", price);
    campgroundData.append("description", description);
    campgroundData.append("location", location);

    // when using FormData loop through array items to send them as arrays to backend
    for (let i = 0; i < images.length; i++) {
      campgroundData.append("images", images[i]);
    }

    if (deletedImages) {
      for (let i = 0; i < deletedImages.length; i++) {
        campgroundData.append("deletedImages", deletedImages[i]);
      }
    }

    try {
      const response = currentCampgroundId
        ? await updateCampground({
            campground: campgroundData,
            campgroundId: currentCampgroundId,
          }).unwrap()
        : await addCampground(campgroundData).unwrap();
      const { message } = response;
      showToast(message, "success");
      clearFormHandler();
    } catch (err) {
      if (err.data.message.startsWith("Cannot read properties")) {
        showToast("Location is a required field!", "error");
      } else {
        showToast(err.data.message, "error");
      }
    }
  };

  return (
    <Paper ref={ref} sx={{ padding: "16px" }} elevation={6}>
      <Typography component="h1" variant="h5" mb={2} align="center">
        {currentCampgroundId ? `Edit a campground` : "Add a new campground"}
      </Typography>
      <form noValidate encType="multipart/form-data" onSubmit={onSubmitHandler}>
        <Stack spacing={2}>
          <TextField
            name="title"
            label="Title"
            type="text"
            placeholder="Sleeping Dunes"
            value={title}
            onChange={onChangeHandler}
            fullWidth
            required
          />
          <TextField
            name="price"
            label="Price"
            type="text"
            placeholder="15.00"
            value={price}
            onChange={onChangeHandler}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            required
          />
          <TextField
            name="location"
            label="Location"
            type="text"
            placeholder="Los Angeles, California"
            value={location}
            onChange={onChangeHandler}
            fullWidth
            required
          />
          <TextField
            name="description"
            label="Description"
            type="text"
            multiline
            rows={4}
            value={description}
            onChange={onChangeHandler}
            fullWidth
          />
          <TextField
            name="images"
            label="Campground Images"
            type="file"
            inputRef={fileInputRef}
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{ inputProps: { multiple: true } }}
            onChange={onImageChangeHandler}
          />
          {currentCampgroundId && (
            <ImageList>
              {databaseImages.map((image, index) => (
                <ImageListItem key={index}>
                  <img src={image.url} alt={`${title}-image-${index}`} />
                  <ImageListItemBar
                    sx={{
                      background:
                        "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
                        "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                    }}
                    position="top"
                    actionIcon={
                      <IconButton>
                        <FormControlLabel
                          label="Delete"
                          labelPlacement="start"
                          sx={{ color: "white", margin: "auto" }}
                          control={
                            <Checkbox
                              color="default"
                              sx={{ color: "white" }}
                              value={image.cloudinary_id}
                              onChange={onImageDeleteHandler}
                            />
                          }
                        />
                      </IconButton>
                    }
                  />
                </ImageListItem>
              ))}
            </ImageList>
          )}
          <LoadingButton
            variant="contained"
            color="error"
            size="small"
            onClick={clearFormHandler}
          >
            Clear
          </LoadingButton>
          <LoadingButton variant="contained" type="submit" size="small">
            Submit
          </LoadingButton>
        </Stack>
      </form>
    </Paper>
  );
});

export default CampgroundForm;
