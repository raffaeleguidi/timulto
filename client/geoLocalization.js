function clientGeocode (lat, lon) {
    try {
        var obj = HTTP.get("http://nominatim.openstreetmap.org/reverse",
                           { params: {
                                 format: "json",
                                 lat: lat,
                                 lon: lon
                             }});
        var address = obj.data.address.road + (obj.data.address.house_number ? ", " + obj.data.address.house_number : "");
        var city = obj.data.address.city;
        var postcode = obj.data.address.postcode;

        if(obj.statusCode==200) {
            return {
                address: address,
                postcode: postcode,
                city: city
            }
        } else {
            return {
                address: "Lat: " + lat + ", Lon: " + lon,
                postcode: 'geocoding error',
                city: obj.statusCode
            }
        }
    } catch (ex) {
        return {
            address: "Lat: " + lat + ", Lon: " + lon,
            postcode: 'geocoding error',
            city: ex.message
        }
    }
}

Meteor.geolocalization = {

    /*geocode: function() {
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
    }*/
    /*geocode: function() {
        try {
            var coords = Geolocation.latLng();
            if (coords && coords.lat && coords.lng) {
                var results = clientGeocode(coords.lat, coords.lng);
                Session.set("address", results.address + ' - ' + results.postcode + ' ' + results.city);
                console.log("address taken in geoLocalization");
                $('#address').val(Session.get("address"));
            }
        } catch(err) {
            console.log("error geocoding " + err.message);
        }
    }*/
    geocode: function() { }
};
