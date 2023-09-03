import { Paper } from "@mui/material";
import Carousel from "react-material-ui-carousel";

const ImageCarousel = ({ images }) => {
  return (
    <Carousel>
      {images.map((image, i) => (
        <Item key={i} imageUrl={image.url} />
      ))}
    </Carousel>
  );
};

const Item = ({ imageUrl }) => {
  return (
    <Paper>
      <img
        src={imageUrl}
        style={{
          borderRadius: "1%",
          width: "100%",
          height: "300px",
          objectFit: "cover",
        }}
      />
    </Paper>
  );
};
export default ImageCarousel;
