import moment from 'moment'
import { Typography, Paper, Divider, CircularProgress } from "@mui/material";
import { useGetCampgroundByIdQuery } from "../../features/campgrounds/campgroundApi";

import ImageCarousel from './ImageCarousel';
import useToastMessages from '../../hooks/useToastMessages';

const CampgroundInfo = ({campgroundId}) => {
  const showToast = useToastMessages()
  const { data, isLoading, isError, error } = useGetCampgroundByIdQuery(campgroundId);
  
  if (isLoading) {
    return <Paper elevation={6}>

      <CircularProgress size='50px' color='info' sx={{display:'flex', justifyContent:'center', alignItems:'center', height: '100vh'}}/>
      </Paper>
  }

  if (isError) {
    return <div style={{fontSize:'50px'}}>{error.data.message}</div>
  }
  
  const campground = data?.campground
  
  return (
       <Paper elevation={3} sx={{ padding: "15px" }}>
          <Typography component='h1' variant='h2' gutterBottom>{campground.title}</Typography>
          <ImageCarousel images={campground.images}/>
          <Typography component='p' variant='body1' gutterBottom sx={{margin: '20px 0'}}>{campground.description}</Typography>
          <Typography component='h5' variant='body1' color='textSecondary' gutterBottom>{`Submitted by ${campground.author.username}`}</Typography>
          <Typography component='h6' variant='body2' color='textSecondary'>Added {moment(campground.createdAt).fromNow()}</Typography>
          <Divider sx={{margin:'20px 0'}}/>
          <Typography variant='subtitle1'>{`Located in ${campground.location}`}</Typography>
          <Divider sx={{margin:'20px 0'}}/>
          <Typography variant='subtitle1'>{`Priced at $${campground.price}/night`}</Typography>
          <Divider sx={{margin:'20px 0'}}/>
    </Paper>
      
  );
};

export default CampgroundInfo;
