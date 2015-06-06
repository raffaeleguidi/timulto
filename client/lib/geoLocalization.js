function clientGeocode (lat, lng, cb) {
        /*http://open.mapquestapi.com/nominatim/v1/reverse.php?format=json&lat=51.521435&lon=-0.162714*/
        /*var obj = HTTP.get("http://nominatim.openstreetmap.org/reverse",*/
        var obj = HTTP.get("http://open.mapquestapi.com/nominatim/v1/reverse.php",
                           { params: {
                                 format: "json",
                                 lat: lat,
                                 lon: lng
                             }}, function(err, res){
            try {
                    if(res.statusCode==200) {
                        //console.log(res);
                        var data = JSON.parse(res.content);
                        var address = data.address.road + (data.address.house_number ? ", " + data.address.house_number : "");
                        var city = data.address.city || data.address.town;
                        var county = data.address.county;
                        var postcode = data.address.postcode;

                        cb( null, {
                            address: address,
                            postcode: postcode,
                            city: city,
                            county: county
                        })
                    } else {
                        cb({
                                code: 'HTTP-' + res.statusCode,
                                message: 'reverse geocoding error'
                        }, {
                            address: "Lat: " + lat + ", Lon: " + lng,
                            postcode: 'geocoding error',
                            city: res.statusCode
                        })
                    }
                } catch (ex) {
                    cb({
                                code: 'exception',
                                message: 'reverse geocoding error'
                        }, {
                        address: "Lat: " + lat + ", Lon: " + lng,
                        postcode: 'geocoding error',
                        city: ex.message
                    })
                }
        });
}

geoLocalization = {

    getLatLng: function() {
        return navigator.geolocation.getCurrentPosition(function (position) {
//            check(position.coords.latitude, Number);  ????
//            check(position.coords.longitude, Number); ????
            if(position) {
                console.log('Found you at', position.coords);
                Session.set("lat",position.coords.latitude);
                Session.set("lng",position.coords.longitude);

                return {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
            } else {
                console.log("error in getLatLng. Position null");
                return {};
            }
        }, function (error) {
            console.error(error);
            return null;
        });
    },
    latLng: function() {
        try {
            var coords = Geolocation.latLng();
            
            if (coords && coords.lat && coords.lng) {
                Session.set("lat",coords.lat);
                Session.set("lng",coords.lng);

                return {
                        lat:coords.lat,
                        lng:coords.lng
                       }
            }
        } catch(err) {
            console.log("error geocoding " + err.message);
        }
    },
    geocode: function() {
        try {
//            console.log("in geocode");
            var coords = Geolocation.latLng();
            console.log("geocode coords %s", JSON.stringify(coords));
            if (coords && coords.lat && coords.lng) {
                /*Meteor.call("reverseGeocode", coords.lat, coords.lng, function(error, results) {*/
                clientGeocode( coords.lat, coords.lng, function(error, results) {
                    if (error) {
                        console.error('skipping reverse geocode because of error: ' + error.message + ' (' + error.code + ')');
                        return;
                    }

                    var address = results.address + ', ' + results.city;
                    Session.set("address", address);
                    Session.set("city", results.city);
                    Session.set("county", results.county);
                    Session.set("postcode", results.postcode);
                    Session.set("lat",coords.lat);
                    Session.set("lng",coords.lng);
                    console.log("address taken in geoLocalization");
                    $('#address').val(address);
                });
            } else {
                console.error("#geocode - lat/lng not set");
            }
        } catch(err) {
            console.error("error geocoding " + err.message);
        }
    }
};
