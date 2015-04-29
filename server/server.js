if (Meteor.isServer) {
    Meteor.startup(function () {

        Restivus.configure({
          useAuth: false,
          prettyJson: true
        });

        // Generates: GET, POST on /api/users and GET, DELETE /api/users/:id for
        Restivus.addCollection(Fines, {excludedEndpoints: ['post', 'put','deleteAll', 'delete']});

        Meteor.publish("fines", function () {
            return Fines.find({}, {sort: {createdAt: -1}});
        });

        Meteor.publish("userData", function () {
            return Meteor.users.find({
                _id: this.userId
            }, {
                fields: {
                    'services.twitter.screenName': 1,
                    'services.twitter.profile_image_url': 1,
//                    'services.facebook':1,
                    'services.facebook.email':1,
                    'services.facebook.picture':1,
                    'services.google.given_name':1
                }
            });
        });
        Meteor.methods({
            reverseGeocode: function (lat, lon) {
                this.unblock();
                try {
                    var obj = HTTP.get("http://nominatim.openstreetmap.org/reverse",
                                       { params: {
                                             format: "json",
                                             lat: lat,
                                             lon: lon
                                         }});
                    var address = obj.data.address.road + (obj.data.address.house_number ? ", " + obj.data.address.house_number : "");
                    var city = obj.data.address.city;
                    
                    var response = {
                        address:address,
                        city:city
                    }
                    return response;
                } catch (ex) {
                    return "Lat: " + lat + ", Lon: " + lon;
                }
            }
        });

    });
}

