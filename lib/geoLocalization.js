function clientGeocode (lat, lon, cb) {
        /*http://open.mapquestapi.com/nominatim/v1/reverse.php?format=json&lat=51.521435&lon=-0.162714*/
        /*var obj = HTTP.get("http://nominatim.openstreetmap.org/reverse",*/
        var obj = HTTP.get("http://open.mapquestapi.com/nominatim/v1/reverse.php",
                           { params: {
                                 format: "json",
                                 lat: lat,
                                 lon: lon
                             }}, function(err, res){
            try {
                    if(res.statusCode==200) {
                        console.log(res);
                        var data = JSON.parse(res.content);
                        var address = data.address.road + (data.address.house_number ? ", " + data.address.house_number : "");
                        var city = data.address.city;
                        var postcode = data.address.postcode;

                        cb( null, {
                            address: address,
                            postcode: postcode,
                            city: city
                        })
                    } else {
                        cb( null, {
                            address: "Lat: " + lat + ", Lon: " + lon,
                            postcode: 'geocoding error',
                            city: res.statusCode
                        })
                    }
                } catch (ex) {
                    cb( null, {
                        address: "Lat: " + lat + ", Lon: " + lon,
                        postcode: 'geocoding error',
                        city: ex.message
                    })
                }
        });

}

Meteor.geolocalization = {

    geocode: function() {
        try {
            var coords = Geolocation.latLng();
            if (coords && coords.lat && coords.lng) {
                /*Meteor.call("reverseGeocode", coords.lat, coords.lng, function(error, results) {*/
                clientGeocode( coords.lat, coords.lng, function(error, results) {
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
