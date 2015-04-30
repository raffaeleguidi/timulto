if (Meteor.isServer) {
    Meteor.startup(function () {

        Restivus.configure({
          useAuth: false,
          prettyJson: true
        });

        // Generates: GET, POST on /api/users and GET, DELETE /api/users/:id for
        //Restivus.addCollection(Fines, {excludedEndpoints: ['post', 'put','deleteAll', 'delete']});

        function findFinesFor(service) {
            var cursor = Fines.find({
                $and:[{approved: 1}, service]
            }, {
                sort:{createdAt:1}
            });
            var res = new Array();

            if(cursor){
                cursor.forEach(function (doc) {
                    res.push(doc);
                });
            }
            return res;
        }

        Restivus.addRoute('fines/:service', {authRequired: false}, {
            get: function () {
              var filter = {};
              filter[this.urlParams.service] = null;
              var fines = findFinesFor(filter);
              if (fines) {
                return fines;
              }
              return {
                statusCode: 404,
                body: {status: 'fail', message: 'Fines not found'}
              };
            }
        });

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

