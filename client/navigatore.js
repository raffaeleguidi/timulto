var directionsDisplay;
var directionsService;
var currentLocation;
var selectedLocation;

function calcRoute() {
//{
//  origin: LatLng | String,
//  destination: LatLng | String,
//  travelMode: TravelMode,
//  transitOptions: TransitOptions,
//  unitSystem: UnitSystem,
//  durationInTraffic: Boolean,
//  waypoints[]: DirectionsWaypoint,
//  optimizeWaypoints: Boolean,
//  provideRouteAlternatives: Boolean,
//  avoidHighways: Boolean,
//  avoidTolls: Boolean,
//  region: String
//}
 
   var request = {
        origin: currentLocation,
        destination: selectedLocation,
        travelMode: google.maps.TravelMode.DRIVING
    };
    console.log("starting navigation");
    directionsService.route(request, function (response, status) {
        console.log("some response frome google. Status " + status);
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
}

Template.navigatore.helpers({
    navigatorMapOptions: function() {
        if (GoogleMaps.loaded()) {
            var lat = Session.get("selectedLat");
            var lon = Session.get("selectedLon");
            selectedLocation = new google.maps.LatLng(lat, lon);
            
            return {
                center: selectedLocation,
                zoom: 10
            };
        }
    }
});

Template.navigatore.events({
    "click #naviga":function(event) {
        calcRoute();
    }
});

Template.navigatore.onCreated(function () {
    // We can use the `ready` callback to interact with the map API once the map is ready.
    GoogleMaps.ready('navigatorMap', function (map) {

        var coords = Geolocation.latLng();

        if (coords) {
            var lat = coords.lat;
            var lon = coords.lng;
//            console.log("setting current position "+ lat+ ","+lon);

            currentLocation = new google.maps.LatLng(lat, lon);
            
            var markerCurrentPos = new google.maps.Marker({
                position: currentLocation,
                map:map.instance
            });
        }
        
        var lat = Session.get("selectedLat");
        var lon = Session.get("selectedLon");
//            console.log("Selected position: lat " + lat + " lon " + lon);
        var markerCurrentPos = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lon),
            map:map.instance,
            icon: 'icon_20X20.png'
        });
        
        directionsService = new google.maps.DirectionsService();
        directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(map.instance);


    });
});
