Meteor.geolocalization = {

    geocode: function() {
        try {
            var coords = Geolocation.latLng();
            if (coords && coords.lat && coords.lng) {
                Meteor.call("reverseGeocode", coords.lat, coords.lng, function(error, results) {
                    Session.set("address", results.address + ' - ' + results.postcode + ' ' + results.city);
                    console.log("address taken in geoLocalization");
                    $('#address').val(Session.get("address"));
                });
            }
        } catch(err) {
            console.log("error geocoding " + err.message);
        }
    }
};
