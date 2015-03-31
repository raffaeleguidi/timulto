Tasks = new Mongo.Collection("tasks");
var blank = "shoot-orange.png";

function geocode() {
    var coords = Geolocation.latLng();
    if (coords.lat && coords.lng) {
        Meteor.call("reverseGeocode", coords.lat, coords.lng, function(error, results) {
            Session.set("address", results);
        });
    }
}

if (Meteor.isClient) {
  // This code only runs on the client
  Session.set("photo", blank);

  Template.body.helpers({
    tasks: function () {
    // Show newest tasks first
       return Tasks.find({}, {sort: {createdAt: -1}});
    }, address: function () {
      return Session.get("address");
    }, description: function () {
      return Session.get("description");
    }, photo: function () {
      return Session.get("photo");
    }, loc: function () {
      // return 0, 0 if the location isn't ready
      return Geolocation.latLng() || { lat: 0, lng: 0 };
    },
    error: Geolocation.error
  });

  Template.body.events({
    "click #shot": function(event) {
        //added correctOrientation=true for samsung phones
        MeteorCamera.getPicture({ width: 800, height: 600, correctOrientation: true }, function(error, data) {
            geocode();
            if (data) {
                Session.set("photo", data);
                $("#description").focus();
                // it would be nice to show keyboard
                // but this requires a cordova plugin
            } else {
                Session.set("photo", blank);
            }
        })
    },
    "click #send": function (event) {
        event.preventDefault();
        var text = $("#description").val();
        var address = $("#address").val();
        var imageData = $("#imgdata").val();
        var lat = $("#lat").val();
        var lng = $("#lng").val();

        Tasks.insert({
          text: text,
          address: address,
          imageData: imageData,
          lat: lat,
          lng: lng,
          createdAt: new Date() // current time
        });

        // Clear form
        $("#description").val("");
        Session.set("description", "");
        Session.set("photo", blank);
        Session.set("address", "");

        // Prevent default form submit (just in case)
        return false;
    }
  });
  Template.task.events({
     "click .toggle-checked": function () {
        // Set the checked property to the opposite of its current value
        Tasks.update(this._id, {$set: {checked: ! this.checked}});
      },
      "click .delete": function () {
        Tasks.remove(this._id);
      }
  });
}

if(Meteor.isCordova){
    //console.log("eccomi");
    Meteor.startup(function(){
        document.addEventListener("backbutton", function() {
            //console.log(JSON.stringify(history));
            //alert(document.location.pathname);
            if (document.location.pathname == "/"){
                //console.log("eccomi 4");
                navigator.app.exitApp();
            } else {
                history.go(-1)
            }
        })
    });
}

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
            }
        });
    });
}


