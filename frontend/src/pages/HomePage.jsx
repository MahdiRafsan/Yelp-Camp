import { useState, useRef } from "react";
import { Container, Grid } from "@mui/material";
import Campgrounds from "../components/Campgrounds/Campgrounds";
import CampgroundForm from "../components/CampgroundForm/CampgroundForm";
const HomePage = () => {
  const [currentCampgroundId, setCurrentCampgroundId] = useState(null);
  // ref to scroll to form on clicking edit
  const formRef = useRef(null);
  return (
    <>
      <Container maxWidth="xl">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={8}>
            <Campgrounds
              formRef={formRef}
              setCurrentCampgroundId={setCurrentCampgroundId}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CampgroundForm
              ref={formRef}
              currentCampgroundId={currentCampgroundId}
              setCurrentCampgroundId={setCurrentCampgroundId}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default HomePage;
