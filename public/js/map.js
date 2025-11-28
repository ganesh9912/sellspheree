mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: coordinates, // Delhi coordinates: [longitude, latitude]
    zoom: 10// starting zoom, you can adjust it

});


console.log(coordinates);

const marker1 = new mapboxgl.Marker({ color: "red" })
    .setLngLat(coordinates)
    .addTo(map)