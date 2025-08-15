
    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // REQUIRED style
        center: listing.geometry.coordinates, // [lng, lat]
        zoom: 9
    });
;

const marker = new mapboxgl.Marker({color:"red"})
.setLngLat(listing.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h4>${listing.location}</h4><p>Exact Location provided after booking</p>`
    )
)   
.addTo(map);