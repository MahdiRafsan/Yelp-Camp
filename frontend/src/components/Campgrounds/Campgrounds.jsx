import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Grid, CircularProgress, Box } from "@mui/material";
import { useGetCampgroundsQuery } from "../../features/campgrounds/campgroundApi";
import Pagination from "../Pagination/Pagination";
import Campground from "./Campground/Campground";
const Campgrounds = ({ formRef, setCurrentCampgroundId }) => {
  const [searchParams, setSearchParams] = useSearchParams({ page: 1 });
  const page = searchParams.get("page");

  const onPageChangeHandler = (event, newPage) => {
    setSearchParams({ page: newPage });
  };

  const { data, isLoading } = useGetCampgroundsQuery({ page });
  const { campgrounds, currentPage, totalPages, totalDocs } = data || {};
  return isLoading ? (
    <CircularProgress color="success" />
  ) : (
    <>
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
      <Box m={2} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={currentPage}
          onPageChange={onPageChangeHandler}
        />
      </Box>
    </>
  );
};

export default Campgrounds;
