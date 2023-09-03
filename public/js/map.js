mapboxgl.accessToken = mapToken; 
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10', 
    center: campground.geometry.coordinates,
    zoom: 9 
});

map.addControl(new mapboxgl.NavigationControl());

const popup = new mapboxgl.Popup({offset: 25}).setHTML(`<h4>${campground.title}</h4><p>${campground.location}</p>`)
new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(popup)
    .addTo(map)