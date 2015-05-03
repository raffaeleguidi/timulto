Meteor.geolocalization = {

    geocode: function() {
        try {
            var coords = Geolocation.latLng();
            if (coords && coords.lat && coords.lng) {
                Meteor.call("reverseGeocode", coords.lat, coords.lng, function(error, results) {
                    Session.set("address", results.address + ' - ' + results.postcode + ' ' + results.city);
                    Session.set("city",results.city);
                    
                });
            }
        } catch(err) {
            console.log("error geocoding " + err.message);
        }
    }
};