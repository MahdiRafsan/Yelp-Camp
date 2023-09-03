import { Grid, CircularProgress } from "@mui/material";
import { useGetCampgroundsQuery } from "../../features/campgrounds/campgroundApi";
import Campground from "./Campground/Campground";
const Campgrounds = ({ formRef, setCurrentCampgroundId }) => {
  const { data, isLoading } = useGetCampgroundsQuery();
  const campgrounds = data?.campgrounds || [];

  return isLoading ? (
    <CircularProgress color="success" />
  ) : (
    <Grid container spacing={2}>
      {campgrounds.map((campground) => {
        return (
          <Grid
            key={campground._id}
            item
            xs={12}
            sm={12}
            md={6}
            lg={4}
            sx={{ display: "flex" }}
          >
            <Campground
              formRef={formRef}
              campground={campground}
              setCurrentCampgroundId={setCurrentCampgroundId}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Campgrounds;
