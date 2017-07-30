
// Satori near line 190



var userMarker;
var map;

var zoomed = false;

var programmaticMove = false;

var search = false;

var requestNumber = 1;

var finalData;
var finalId;

var isFood = false;

var spinner;

var venues = undefined;
var reports = undefined;
var locationReports = undefined;

var liveData = [];

var spinning = false;

$(document).ready(() => {
    $("#map").height(window.innerHeight);
    $("#search-area").height(window.innerHeight).hide();
    $("#details-area").height(window.innerHeight).hide();

    $("#search-box").prop("disabled", true);
    $("#map").addClass("loading");

    $("#quickSearch").css("marginTop", $("#search-div").height() + 15 + 25); // 15 + 25 = paddingBottom + paddingTop of search-div

    map = L.map("map", {
        zoomControl: false
    }).setView([37, -122], 5);

    createLocateButton();
    setupAnimateCSS();

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


    $("#quick-food").click(() => {
        $("#search-box").val("Food").triggerHandler("paste");
        isFood = true;
    });

    $("#quick-gas").click(() => {
        $("#search-box").val("Gas Station").triggerHandler("paste");
        isFood = false;
    });

    $("#quick-coffee").click(() => {
        $("#search-box").val("Coffee").triggerHandler("paste");
        isFood = false;
    });

    $("#quick-grocery").click(() => {
        $("#search-box").val("Grocery").triggerHandler("paste");
        isFood = false;
    });

    $("#quick-hospital").click(() => {
        $("#search-box").val("Hospital").triggerHandler("paste");
        isFood = false;
    });

    $("#quick-lodging").click(() => {
        $("#search-box").val("Lodging").triggerHandler("paste");
        isFood = false;
    });

    $("#search-box").on("input propertychange paste", () => {
        let search = $("#search-box").val();
        $("#results").html("");
        startSpinner();
        console.log(search);
        requestNumber++;
        venues = undefined;
        reports = undefined;
        locationReports = undefined;

        $.post("/api/venues/search", {lat: userMarker.getLatLng().lat, long: userMarker.getLatLng().lng, searchstring: search}, ((reqNumber, body) => {
            if(reqNumber === requestNumber) { // Check if latest request
                venues = body.venues;
                if(venues && reports && locationReports) updateSearchResults();
            }
        }).bind(undefined, requestNumber));

        $.get("/api/Reports", ((reqNumber, body) => {
            if(reqNumber === requestNumber) { // Check if latest request
                reports = body;
                if(venues && reports && locationReports) updateSearchResults();
            }
        }).bind(undefined, requestNumber));

        $.get("/api/LocationReports", ((reqNumber, body) => {
            if(reqNumber === requestNumber) { // Check if latest request
                locationReports = body;
                if(venues && reports && locationReports) updateSearchResults();
            }
        }).bind(undefined, requestNumber));
    });

    $("#search-box").focus(() => {
        if(!search) {
            search = true;
            $("#back-button").css("left", "0%").animate({"left": "5%"}, 200);
            $("#search-box").animate({width: "74%"}, 400);
            $("#search-area").show("blind", {direction: "down"}, 400);
            $("#search-div").css("background-color", "#F6F6F6");

            let startTime = 300;
            let seperationTime = 50;
            setTimeout(() => $("#quick-food").css("visibility", "visible").animateCss("bounceIn"), startTime + 0);
            setTimeout(() => $("#quick-gas").css("visibility", "visible").animateCss("bounceIn"), startTime + 1 * seperationTime);
            setTimeout(() => $("#quick-coffee").css("visibility", "visible").animateCss("bounceIn"), startTime + 2 * seperationTime);
            setTimeout(() => $("#quick-grocery").css("visibility", "visible").animateCss("bounceIn"), startTime + 3 * seperationTime);
            setTimeout(() => $("#quick-hospital").css("visibility", "visible").animateCss("bounceIn"), startTime + 4 * seperationTime);
            setTimeout(() => $("#quick-lodging").css("visibility", "visible").animateCss("bounceIn"), startTime + 5 * seperationTime);

            // Incase functions are out of order
            setTimeout(() => $(".quick-icon").css("visibility", "visible"), startTime + 600);
            setTimeout(() => $(".quick-icon").css("visibility", "visible"), startTime + 700);

            setTimeout(() => {
                $("#results").css("height", $("#search-area").height() - $("#quickSearch").height() - 91);
            }, 1500);
        }
    });

    $("#reportButton").click(() => {
        setTimeout(() => {
            $("#rating1").rateYo({
                halfStar: true
            });

            $("#rating2").rateYo({
                halfStar: true
            });

            $("#commentsTextArea").val("");
        }, 250);
    });

    $("#modal-submit").click(() => {
        let rating1 = parseFloat($("#rating1").rateYo("rating")) * 2;
        let rating2 = parseFloat($("#rating2").rateYo("rating")) * 2;
        let comments = $("#commentsTextArea").val();


        /**
         *
         * FOR ARCHIVING
         *
         */
        $.post("/api/LocationReports", {locationId: finalId, generalSafety: rating1, cleanliness: rating2, comment: comments});

        // Satori API used here
        /**
         *
         * FOR REAL-TIME ACCESS FROM OTHER CLIENTS
         *
         */
        client.publish("reports", {locationId: finalId, generalSafety: rating1, cleanliness: rating2, comment: comments} , function (pdu) {
            if (pdu.action === 'rtm/publish/ok') {
                console.log('Publish confirmed');
            } else {
                console.log('Failed to publish. RTM replied with the error  ' +
                    pdu.body.error + ': ' + pdu.body.reason);
            }
        });

        $("#commentsTextArea").val("");
        $("#reportModal").modal("hide");
    });

    $("#back-button").click(() => {
        if(search) {
            search = false;
            $("#results").html("<div style=\"width: 100%; text-align: center;\"><br>Enter a search query to see search results here...</div>");
            $("#back-button").animate({"left": "0%"}, 100, () => {
                $("#back-button").css("left", "-15%");
            });
            $("#search-box").animate({width: "90%"}, 400);
            $("#search-area").hide("blind", {direction: "down"}, 400);
            $("#search-div").css("background-color", "transparent");

            setTimeout(() => $(".quick-icon").css("visibility", "hidden"), 1000);

            $("#search-box").val("");
        }
    });

    $("#back-button-2").click(() => {
        $("#details-area").hide("slide", {direction: "right"}, 400);
    });
});

function showLocation(location) {
    console.log(location.coords);
    let coords = [location.coords.latitude, location.coords.longitude];
    if(!userMarker) {
        userMarker = L.layerGroup([L.circleMarker(coords, {fillOpacity: 1.0, radius: 5}), L.circleMarker(coords, {fillOpacity: 0.2, radius: 45, opacity: 0})]).addTo(map);
        // TODO FIX THE SSL
        // TODO ADD PUBSUB
        // TODO ADD PUSH
        // TODO Loopback
        // TODO FIX FIX THE LOADING SPINNER

        programmaticMove = true;
        map.setZoom(16);
        map.panTo(coords);
        programmaticMove = false;
        zoomed = true;

        $("#search-box").prop("disabled", false);
        $("#map").removeClass("loading");
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
            container.style.zIndex = "25000";

            // TODO Make locate & zoom buttons rounded

            container.style.backgroundImage = "url(my_location.svg)";
            container.style.backgroundSize = "25px 25px";
            container.style.backgroundRepeat = "no-repeat";
            container.style.backgroundPosition = "center center";

            container.onclick = function() {
                console.log("click");
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

function setupAnimateCSS() {
    $.fn.extend({
        animateCss: function (animationName) {
            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            this.addClass('animated ' + animationName).on(animationEnd, function() {
                $(this).removeClass('animated ' + animationName);
            });
            return this;
        }
    });
}

function updateSearchResults() {
    console.log(venues);
    console.log(reports);
    console.log(locationReports);

    venues = _.map(venues, (venue) => {
        if(venue.name.indexOf("a great place") > -1) venue.name = venue.name.split("-")[0];
        let venueReports = _.filter(locationReports, report => report.locationId === venue.id) || [];
        venue.venueComments = _.pluck(venueReports, "comment") || [];
        venue.venueSafetyAverage = Math.round(_.reduce(_.pluck(venueReports, "generalSafety"), function(memo, num){ return memo + num; }, 0) / venueReports.length);
        venue.venueCleanlinessAverage = Math.round(_.reduce(_.pluck(venueReports, "cleanliness"), function(memo, num){ return memo + num; }, 0) / venueReports.length);

        let nearbyReports = _.filter(reports, (report) => {
            return getDistanceFromLatLonInKm(report.lat, report.long, venue.location.lat, venue.location.lng) < 1; // Closer than 1km = close enough
        });
        venue.nearbyComments = _.pluck(nearbyReports, "comments") || [];
        venue.nearbySafetyAverage = Math.round(_.reduce(_.pluck(nearbyReports, "generalSafety"), function(memo, num){ return memo + num; }, 0) / nearbyReports.length);
        venue.nearbyCleanlinessAverage = Math.round(_.reduce(_.pluck(nearbyReports, "cleanliness"), function(memo, num){ return memo + num; }, 0) / nearbyReports.length);

        return venue;
    });

    venues = _.sortBy(venues, (venue) => -(safeAvg(venue.venueSafetyAverage, venue.nearbySafetyAverage) || 4));

    finalData = venues;

    var htmlArray = _.map(finalData, (venue) => {
        return `
            <div class="card" style="margin-top: 10px; cursor: pointer; background-color: ${safeAvg(venue.venueSafetyAverage, venue.nearbySafetyAverage) > 7 ? "#CBFDCB" : (safeAvg(venue.venueSafetyAverage, venue.nearbySafetyAverage) < 4 ? "#FFCBCB" : "white")}" onclick="viewMoreInfo('${venue.id}')">
                <div class="card-block">
                    <h4 class="card-title">${venue.name} <span class="pull-right text-info" style="text-align: center; line-height: 0.8;">${(venue.location.distance * 0.000621371).toFixed(1)}<br><span style="font-size: 12px;">miles away</span></span></h4>
                    <p class="card-text" style="font-size: 15px;">
                        ${venue.location.formattedAddress[0] + "<br>" + venue.location.formattedAddress[1]}
                        <span class="pull-right"><span style="text-align: center;">Safety:</span><br>${getFA(safeAvg(venue.venueSafetyAverage, venue.nearbySafetyAverage))}</span>
                    </p>
                </div>
            </div>
        `;
    });

    stopSpinner();
    $("#results").html("<div style='width: 90%; margin: 0 auto;'>"+htmlArray.join("")+"</div>");
}


function viewMoreInfo(id) {
    finalId = id;
    isFood = $("#search-box").val() === "Food";
    console.log(id);
    // Blank pixel
    $("#details-image").prop("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=");
    $("#details-image").css("display", "none");

    $.get(`https://api.foursquare.com/v2/venues/${id}/photos?v=20170101&client_id=YU22IYZ050HHUIRKJGEXT4ENBWUJTS5D524T2IBKGSJMBFPB&client_secret=ZPBQXS4OKS5J1VNEZC0HUXEPTLQ0OS5U0PPCLSSNGKLEIBE1`, (body) => {
        console.log(body);
        if(body) {
            let data = body;
            if(data) {
                let items = data.response.photos.items;
                if(items.length > 0) {
                    let url = items[0].prefix + "900" + items[0].suffix;
                    $("#details-image").prop("src", url);
                    $("#details-image").css("display", "block");
                }
            }
        }
    });

    let venue = _.findWhere(finalData, {id});
    $("#details-name").html(venue.name);
    $("#details-distance").html((venue.location.distance * 0.000621371).toFixed(1));
    $("#details-address").html(venue.location.formattedAddress.join(", "));
    $("#safetyStars").html(getFA(safeAvg(venue.venueSafetyAverage, venue.nearbySafetyAverage)));
    $("#cleanlinessStars").html(getFA(venue.venueCleanlinessAverage));
    if(!isFood) $("#button-button").hide();
    else $("#button-button").show();

    if(venue.venueComments.concat(venue.nearbyComments).length > 0) {
        $("#comments-list").html(("<li class=\"list-group-item\"><h4>Comments: </h4></li>" + (_.map(_.reject(venue.venueComments.concat(venue.nearbyComments), (text) => !text || text.length < 3), comment => `<li class=\"list-group-item\">${comment}</li>`)).join("") || "<li class=\"list-group-item\">No comments found</li>"));
    } else {
        $("#comments-list").html(("<li class=\"list-group-item\"><h4>Comments: </h4></li>" + "<li class=\"list-group-item\">No comments found</li>"));
    }
    $("#getDirectionsBtn").prop("href", "https://www.google.com/maps/dir/?api=1&destination="+venue.location.formattedAddress.join(", "));


    console.log(venue);

    $("#details-main").css("marginTop", 75);
    $("#details-area").show("slide", {direction: "right"}, 400);

}






function safeAvg(v1, v2) {
    if(isNaN(v1) && isNaN(v2)) return NaN;
    if(isNaN(v1)) return v2;
    if(isNaN(v2)) return v1;
    return v1 + v2 / 2;
}

function getFA(value) {
    // 1-10
    let star = (val, val2) => {
        if (val2 - val <= 0) return "<i class=\"fa fa-star\" style='color: #D29119; padding-right: 1px;'></i>";
        if (val2 - val == 1) return "<i class=\"fa fa-star-half-o\" style='color: #D29119; padding-right: 1px;'></i>";
        if (val2 - val >= 2) return "<i class=\"fa fa-star-o\" style='padding-right: 1px;'></i>";
    };

    if(isNaN(value)) return "(Unknown)";
    return star(value, 2) + star(value, 4) + star(value, 6) + star(value, 8) + star(value, 10);
}


function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

function startSpinner() {
    if(spinning) return;
    spinning = true;
    var options = {
        lines: 13 // The number of lines to draw
        , length: 28 // The length of each line
        , width: 14 // The line thickness
        , radius: 42 // The radius of the inner circle
        , scale: 0.4 // Scales overall size of the spinner
        , corners: 1 // Corner roundness (0..1)
        , color: '#000' // #rgb or #rrggbb or array of colors
        , opacity: 0.25 // Opacity of the lines
        , rotate: 0 // The rotation offset
        , direction: 1 // 1: clockwise, -1: counterclockwise
        , speed: 0.6 // Rounds per second
        , trail: 35 // Afterglow percentage
        , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
        , zIndex: 2e9 // The z-index (defaults to 2000000000)
        , className: 'spinner' // The CSS class to assign to the spinner
        , top: '40%' // Top position relative to parent
        , left: '50%' // Left position relative to parent
        , shadow: false // Whether to render a shadow
        , hwaccel: false // Whether to use hardware acceleration
        , position: 'absolute' // Element positioning
    };
    var target = document.getElementsByTagName("body")[0];
    spinner = new Spinner(options).spin(target);

    setTimeout(stopSpinner, 5000); // Stop the spinner if it gets stuck more than 5 seconds
}

function stopSpinner() {
    if(spinner) spinner.stop();
    spinner = undefined;
    spinning = false;
}

function gotData(data) {
    liveData.push(data);
    console.log(data);
}