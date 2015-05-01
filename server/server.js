//if (Meteor.isServer) {
    Meteor.startup(function () {

        Restivus.configure({
          useAuth: false,
          prettyJson: true
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
        
        function isAdministrator() {
            var username;
            //    console.log("#isAdministrator: " + JSON.stringify(Meteor.user()));
            //    console.log("Meteor.user() "+ JSON.stringify(Meteor.user()));
            //    console.log("Meteor.userId() "+ Meteor.userId());
            if (Meteor.user()) {
                if (Meteor.user().services.facebook) {
                    username = Meteor.user().services.facebook.email;
                } else if (Meteor.user().services.twitter) {
                    username = Meteor.user().services.twitter.screenName;
                }
                //console.log(username);
            }

            //    var userAdm = Administrators.find({"username":username},{limit:1}).fetch()[0];
            var userAdm = Administrators.findOne({
                username: username
            });

            //    console.log("userAdm " + JSON.stringify(userAdm)+" looking for "+username);

            if (!userAdm) {
                console.log(username + " is not admin");
                return false;
            } else {
                console.log(username + " is  admin!!!!");
                return true;
            }
        };
        
        Meteor.methods({
//            isAdministrator: function () {
//                return isAdministrator();
//            },
            approveFine: function (fineId) {

                if (isAdministrator()) {
                    Fines.update({
                        "_id": fineId
                    }, {
                        $set: {
                            "approved": 1
                        }
                    });
                } else {
                    console.log("User is not an administrator: " + JSON.stringify(Meteor.user().profile.name));
                }
            },
            deleteFine: function (fineId) {//TODO da aggiungere la logica che controlla se l'utente è admin o l'utente corrente "possiede" il fine

                if(isAdministrator()) { //Se amministratore, è possibile rimuovere la segnalazione
                    console.log("removing fine " + fineId);
                    Fines.remove(fineId);
                } else{
                    var res = Fines.findOne(fineId);
                    console.log("Res.owner:"+res.owner + " - Userid:"+Meteor.userId());
                    if(res && res.owner === Meteor.userId()) {//se l'utente corrente ha creato la segnalazione può anche rimuoverla
                        Fines.remove(fineId);
                    } else {
                        console.log("User is not an administrator and does not own the fine: "+ JSON.stringify(Meteor.user().profile.name));
                    }
                }
            },
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
                    var postcode = obj.data.address.postcode;
                    
                    var response = {
                        address: address,
                        postcode: postcode,
                        city: city
                    }
                    return response;
                } catch (ex) {
                    return "Lat: " + lat + ", Lon: " + lon;
                }
            }
        });

    });
//}

