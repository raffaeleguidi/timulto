Tasks = new Mongo.Collection("tasks");

if (Meteor.isServer) {
    Meteor.startup(function () {
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
            },
            getFines: function() {
                return Tasks.find({}, {sort: {createdAt: -1}});
            },
            saveFine: function (text, address, lat, lng, category, canvas, imageData) {
                // Make sure the user is logged in before inserting a task
                /*if (! Meteor.userId()) {
                  throw new Meteor.Error("not-authorized");
                }*/

                Tasks.insert({
                  text: text,
                  address: address,
                  imageData: imageData,
                  category: category,
                  lat: lat,
                  lng: lng,
                  createdAt: new Date() // current time
                });

            },
            deleteFine: function (fineId) {
                //Tasks.remove(taskId);
            },
            setChecked: function (fineId, setChecked) {
                //Tasks.update(taskId, { $set: { checked: setChecked} });
            }
        })
    });
}

