if (Meteor.isServer) {
    Meteor.startup(function () {

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
                    'services.facebook.name':1,
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
                    var ret = obj.data.address.road + (obj.data.address.house_number ? ", " + obj.data.address.house_number : "");
                    return ret;
                } catch (ex) {
                    return "Lat: " + lat + ", Lon: " + lon;
                }
            }
        });

    });
}

