Tasks = new Mongo.Collection("tasks");
var blank = "shoot-orange.png";
var photoTaken = false;

function drawButton() {
    photoTaken = false;
    Session.set("photo", blank);
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var imageObj = new Image();

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'white';
    context.fill();
    var photo = new Image();
    photo.onload = function() {
        context.drawImage(photo,
            (canvas.width - photo.width) / 2,
            (canvas.height - photo.height) / 2
        );
    };
    photo.src =  Session.get("photo");
}

function fitImageInCanvas(data, canvas) {
    var context = canvas.getContext('2d');
    var photo = new Image();
    photo.onload = function() {
        var scaled = (canvas.width * photo.height) / photo.width;
        // canvas.width : x = photo.width : photo.height
        if (photo.width > photo.height) {
            context.drawImage(photo,
                0,
                (canvas.height - scaled) / 2,
                canvas.width,
                scaled
            );
        }
    };
    photo.src =  data;
}

function geocode() {
    try {
        var coords = Geolocation.latLng();
        if (coords.lat && coords.lng) {
            Meteor.call("reverseGeocode", coords.lat, coords.lng, function(error, results) {
                Session.set("address", results);
            });
        }
    } catch(err) {
        console.log("error geocoding " + err.message);
    }
}

if (Meteor.isClient) {
  Meteor.startup(function(){
      // This code only runs on the client
      Session.set("photo", blank);
      drawButton();
  });

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
            } else {
                Session.set("photo", blank);
            }
        })
    },
    "click #canvas": function (event) {
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');

        if (!photoTaken) {
            MeteorCamera.getPicture({ width: 800, height: 600, correctOrientation: true }, function(error, data) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                geocode();
                if (data) {
                    photoTaken = true;
                    fitImageInCanvas(data, canvas)
                    Session.set("photo", data);
                    $("#description").focus();
                } else {
                    photoTaken = false;
                    Session.set("photo", blank);
                }
            });
        } else {
            var imageObj = new Image();
            imageObj.onload = function() {
                context.drawImage(imageObj,
                    event.offsetX - imageObj.width / 4,
                    event.offsetY - imageObj.height / 4,
                    imageObj.width / 2,
                    imageObj.height / 2
                );
            };
            imageObj.src =  "icon.png";
        }
    },
    "click #send": function (event) {
        event.preventDefault();
        var text = $("#description").val();
        var address = $("#address").val();
        //var imageData = $("#imgdata").val();
        var lat = $("#lat").val();
        var lng = $("#lng").val();
        var canvas = document.getElementById('canvas');
        var imageData = canvas.toDataURL();
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
        drawButton();

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


