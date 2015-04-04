Tasks = new Mongo.Collection("tasks");

if(Meteor.isCordova){
    Meteor.startup(function(){
        document.addEventListener("backbutton", function() {
            if (document.location.pathname == "/"){
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


