Tasks = new Mongo.Collection("tasks");
var blank = "scatta.png";

if (Meteor.isClient) {
  Session.set("photo", blank);

  // This code only runs on the client
  Template.body.helpers({
    tasks: function () {
    // Show newest tasks first
       return Tasks.find({}, {sort: {createdAt: -1}});
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
        //event.preventDefault();
        MeteorCamera.getPicture({ width: 300, height: 300 }, function(error, data) {
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
        var imageData = $("#imgdata").val();
        var lat = $("#lat").val();
        var lng = $("#lng").val();

        Tasks.insert({
          text: text,
          imageData: imageData,
          lat: lat,
          lng: lng,
          createdAt: new Date() // current time
        });

        // Clear form
        $("#description").val("");
        Session.set("photo", blank);

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



