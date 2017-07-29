var userMarker;
var map;

var zoomed = false;

var programmaticMove = false;

$(document).ready(() => {
    $("#map").height(window.innerHeight);

    map = L.map("map", {
        zoomControl: false
    }).setView([37, -122], 5);

    createLocateButton();

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

    //L.control.watermark({position: "bottomleft"}).addTo(map);


    map.on("zoomstart", () => {
        if(!programmaticMove) {
            zoomed = false;
        }
    });

    map.on("dragstart", () => {
        if(!programmaticMove) {
            zoomed = false;
        }
    });
});

function showLocation(location) {
    console.log(location.coords);
    let coords = [location.coords.latitude, location.coords.longitude];
    if(!userMarker) {
        userMarker = L.marker(coords).addTo(map);
        programmaticMove = true;
        map.setZoom(17);
        map.panTo(coords);
        programmaticMove = false;
        zoomed = true;
    } else {
        userMarker.setLatLng(coords);
        if(zoomed) {
            programmaticMove = true;
            map.panTo(coords);
            programmaticMove = false;
        }
    }
}


function createLocateButton() {
    L.Control.Locate = L.Control.extend({
        onAdd: function(map) {
            var img = L.DomUtil.create('img');

            img.src = '../../docs/images/logo.png';
            img.style.width = '200px';

            return img;
        }
    });

    L.control.locate = (opts) => new L.Control.Locate(opts);
}















