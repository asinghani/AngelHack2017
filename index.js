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

    L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYXNpbmdoYW5pIiwiYSI6ImNpaDV0cXpzajAzcmN0Z20yNzZ2OGtpM3cifQ.RZcxkKjXBBwsXP-BrUjaiQ", {
        maxZoom: 18
    }).addTo(map);

    if (navigator.geolocation) {
        options = {
            enableHighAccuracy: true,
            timeout: 1000,
            maximumAge: 0
        };

        navigator.geolocation.watchPosition(showLocation, console.error, options);
    }

    L.control.locate({position: "bottomleft"}).addTo(map);


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

    $("#search-box").focus(() => {
        console.log("adding");
        $("#search-box").animate({width: "83%"}, 800);
        $("#back-button").animate({ 'height': '220px', 'width': '200px' }, 800);
    });
});

function showLocation(location) {
    console.log(location.coords);
    let coords = [location.coords.latitude, location.coords.longitude];
    if(!userMarker) {
        userMarker = L.marker(coords).addTo(map);
        programmaticMove = true;
        map.setZoom(16);
        map.panTo(coords);
        programmaticMove = false;
        zoomed = true;
    } else {
        userMarker.setLatLng(coords);
        if(zoomed) {
            programmaticMove = true;
            map.flyTo(coords);
            programmaticMove = false;
        }
    }
}

function createLocateButton() {
    L.Control.Locate = L.Control.extend({
        onAdd: function(map) {
            var container = L.DomUtil.create("div", "leaflet-bar leaflet-control leaflet-control-custom");

            container.style.backgroundColor = "white";
            container.style.width = "40px";
            container.style.height = "40px";
            container.style.marginBottom = "20px";

            // TODO Make locate & zoom buttons rounded

            container.style.backgroundImage = "url(my_location.svg)";
            container.style.backgroundSize = "25px 25px";
            container.style.backgroundRepeat = "no-repeat";
            container.style.backgroundPosition = "center center";

            container.onclick = function() {
                zoomed = true;

                programmaticMove = true;
                map.flyTo(userMarker.getLatLng(), 16);
                programmaticMove = false;
            };

            return container;
        }
    });

    L.control.locate = (opts) => new L.Control.Locate(opts);
}















