var userMarker;
var map;

$(document).ready(() => {
    $("#map").height(window.innerHeight);

    map = L.map("map", {
        zoomControl: false
    }).setView([37, -122], 5);

    map.addControl(L.control.zoom({position: "bottomright"}));

    L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: "pk.eyJ1IjoiYXNpbmdoYW5pIiwiYSI6ImNpaDV0cXpzajAzcmN0Z20yNzZ2OGtpM3cifQ.RZcxkKjXBBwsXP-BrUjaiQ"
    }).addTo(map);

    if (navigator.geolocation) {
        options = {
            enableHighAccuracy: true,
            timeout: 1000,
            maximumAge: 0
        };

        navigator.geolocation.watchPosition(showLocation, console.error, options);
    }
});

function showLocation(location) {
    console.log(location.coords);
    let coords = [location.coords.latitude, location.coords.longitude];
    if(!userMarker) {
        userMarker = L.marker(coords).addTo(map);
        map.setZoom(17);
        map.panTo(coords);
    } else {
        userMarker.setLatLng(coords);
        map.panTo(coords);
    }
}
