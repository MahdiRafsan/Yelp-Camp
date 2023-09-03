import mapboxgl from "mapbox-gl";
import { useState, useEffect, useRef } from "react";
import { useGetCampgroundByIdQuery } from "../features/campgrounds/campgroundApi";
const MapBox = ({ campgroundId }) => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoibWFoZGlyYWZzYW4iLCJhIjoiY2xqN2k4NGRsMG43azNlbXhyODV4dG5mNyJ9.t5yLYOKEfV_7T9aoEdsm1w";

  const { data, isSuccess } = useGetCampgroundByIdQuery(campgroundId);
  let campground;
  if (isSuccess) {
    campground = data?.campground;
  }

  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [lng, setLng] = useState();
  const [lat, setLat] = useState();
  const [zoom, setZoom] = useState(6);
  useEffect(() => {
    if (isSuccess) {
      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: campground?.geoLocation?.coordinates,
        zoom: zoom,
      });

      new mapboxgl.Marker()
        .setLngLat(campground?.geoLocation?.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h2>${campground.title}</h2><p>${campground.location}</p>`
          )
        )
        .addTo(mapInstance);

      mapInstance.addControl(new mapboxgl.NavigationControl(), "top-right");

      mapInstance.on("move", () => {
        setLng(mapInstance.getCenter().lng.toFixed(4));
        setLat(mapInstance.getCenter().lat.toFixed(4));
        setZoom(mapInstance.getZoom().toFixed(2));
      });

      setMap(mapInstance);
    }
    return () => {
      if (map) map.remove();
    };
  }, [isSuccess, data]);

  return <div ref={mapContainer} style={{ height: "400px" }} />;
};

export default MapBox;