function setupInitialData() {

    function updateApproved() {
        Fines.update({ approved:0 },{ $set: { approved: false }}, { multi: true}, function(err,res){ console.log("err: " +err + ", for approved=0 updated rows: " + res); });
        Fines.update({ approved:1 },{ $set: { approved: true }}, { multi: true}, function(err,res){ console.log("err: " +err + ", for approved=1 updated rows: " + res); });
    }

    updateApproved();

    function addCategory(key, value) {
        if (Categories.find({key: key}).count() == 0) {
            Categories.insert({
              key: key,
              value: value
            });
            console.log('added %s=%s', key, value);
        }
    }

    //Categories.remove({});

    addCategory('PRC', 'Parcheggio incivile');
    addCategory('RFT', 'Rifiuti o cassonetti sporchi');
    addCategory('ACC', 'Accessibilità scarsa o mancante');
    addCategory('ABS', 'Abusivismo');
    //addCategory('AFF', 'Affissioni abusive');
    //addCategory('BLL', 'Bullismo');
    //addCategory('CSS', 'Cassonetti sporchi');
    addCategory('DST', 'Disturbo della quiete pubblica');
    addCategory('ILL', 'Illuminazione');
    addCategory('MNT', 'Manto stradale');
    addCategory('VND', 'Atti vandalici');
    //addCategory('MRC', 'Marciapiede sporco');
    addCategory('SGN', 'Segnaletica mancante');
    //addCategory('VLZ', 'Atti di violenza');
    addCategory('MLT', 'Maltrattamento animali');

    console.log("found %d categories in db", Categories.find().count());

    function addAdministrator(username,service) {
        if (Administrators.find({$and:[{username: username},{service:service}]}).count() == 0) {
            Administrators.insert({
              username: username,
              service:service
            });
            console.log('added %s for %s social.', username, service);
        }
    }

    addAdministrator('manuel_morini', 'twitter');
    addAdministrator('raffaeleguidi', 'twitter');
    addAdministrator('aferracci', 'twitter');
    console.log("found %d administrators in db", Administrators.find().count());
}

Meteor.startup(function () {

    // <meta name="viewport" content="width=device-width, initial-scale=1">

    Inject.meta("viewport", "width=device-width, initial-scale=1");

    ROOT_URL = process.env.ROOT_URL;

    console.log("ROOT_URL=" + ROOT_URL);
    console.log("env.ROOT_URL=" + process.env.ROOT_URL);
    console.log("env.MOBILE_ROOT_URL=" + process.env.MOBILE_ROOT_URL);


    setupInitialData();

    Restivus.configure({
      useAuth: false,
      prettyJson: true
    });

    Meteor.publish("fines", function () {
        return Fines.find({ createdAt: { $gte: Common.yesterday() } },{fields:{imageData:0}},{ sort: {createdAt: -1} });
    });

    Meteor.publish("categories", function () {
        return Categories.find({});
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
        var service;
        //    console.log("#isAdministrator: " + JSON.stringify(Meteor.user()));
        //    console.log("Meteor.user() "+ JSON.stringify(Meteor.user()));
        //    console.log("Meteor.userId() "+ Meteor.userId());
        if (Meteor.user()) {
            if (Meteor.user().services.facebook) {
                username = Meteor.user().services.facebook.email;
                service  = "facebook";
            } else if (Meteor.user().services.twitter) {
                username = Meteor.user().services.twitter.screenName;
                service  = "twitter";
            }
            //console.log(username);
        }

        //    var userAdm = Administrators.find({"username":username},{limit:1}).fetch()[0];
        var userAdm = Administrators.findOne({$and:[{username: username},{service:service}]});

        if (Meteor.user().services.password) {
            userAdm = Meteor.user();
        }
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
        getLikes: function(fineId) {
            var likes = 0;
            if(fineId) {
                try{db.fines.aggregate([{$unwind:"$likes"},{$group:{_id:"$_id",count:{$sum:1}}}])
                    likes = Fines.aggregate(
                        [{
                            $match:
                                { _id:fineId }
                         },
                         {
                             $project: {
                                _id: 1,
                                count: { $size: "$likes" }
                             }
                        }]);

                    console.log("found likes : " + JSON.stringify(likes));
                    likes = likes.count;
                } catch (error) {
                    console.log("caught an error!");
                    console.error(error);
                }
            }

            return likes;
        },
        //like -> boolean, true indica approvazione, false indica non approvazione dell'utente
        likeFine: function(fineId, like) {
            var username = "";

            if(Meteor.user() && fineId) {
                if(Meteor.user().services.twitter) {
                    username = Meteor.user().services.twitter.screenName;
                } else  if(Meteor.user().services.facebook) {
                    username = services.facebook.email;
                }
                console.log("User "+username +" said: I " + (like==true?"like":"don't like") +  " fine "+fineId);

                if(like) {
                    Fines.update({_id:fineId},{$addToSet:{likes:username}},
                                function(err,result){
                        if(err) {
                            console.log("error in liking:" + err);
                            throw new Meteor.Error("Error:"+ err);
                        }
                        console.log("Result:" + result);
                    });
                } else {
                    Fines.update({_id:fineId},{$pull:{likes:username}},
                                function(err,result){
                        if(err) {
                            console.log("error in not liking:" + err);
                            throw new Meteor.Error("Error:"+ err);
                        }
                        console.log("Result:" + result);
                    });
                }
            }
        },
        rootUrl: function() {
            /*console.log("ROOT_URL=" + process.env.ROOT_URL);
            console.log("env.ROOT_URL=" + process.env.ROOT_URL);
            console.log("env.MOBILE_ROOT_URL=" + process.env.MOBILE_ROOT_URL);*/
            return process.env.ROOT_URL;
        },
        approveFine: function (fineId) {

            if (fineId && isAdministrator()) {
                Fines.update({
                    "_id": fineId
                }, {
                    $set: {
                        "approved": true
                    }
                });

                return true;
//                    var fine = Fines.find({_id:fineId});
                //Send notification
                //serverNotification(fine);
            } else {
                console.log("Trying to approve fine "+ fineId +".User is not an administrator: " + JSON.stringify(Meteor.user().profile.name));
                return null;
            }
        },
        deleteFine: function (fineId) {//TODO da aggiungere la logica che controlla se l'utente è admin o l'utente corrente "possiede" il fine

            if(fineId && isAdministrator()) { //Se amministratore, è possibile rimuovere la segnalazione
//                    console.log("removing fine " + fineId);
                Fines.remove(fineId);

                //Send notification
                //var fine = Fines.find({_id:fineId});
                //Send notification
                //serverNotification(fine);
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
        fineImage: function(fineId){
            return Fines.findOne({_id:fineId},{fields:{imageData:1}});
        },
        updateImage: function(fineId, newImageData) {
            if(fineId && isAdministrator()) {

                Fines.update(
                    { _id:fineId },
                    {
                        $set: { imageData:newImageData},
                        $inc:{version:1}
                    },
                    function(err,result){
                        if(err) {
                            console.log("Error in updating image: "+err);
                            return { error : err };
                        } else {
                            console.log("before clean");
                            fileUtils.cleanTmpImages(Fines.findOne({_id: fineId}));
                            console.log("after clean");

                            return {
                                error:null,
                                result : 'ok'
                            }
                        }
                    });
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

                if(obj.statusCode==200) {
                    return {
                        address: address,
                        postcode: postcode,
                        city: city
                    }
                } else {
                    return {
                        address: "Lat: " + lat + ", Lon: " + lon,
                        postcode: 'geocoding error',
                        city: obj.statusCode
                    }
                }
            } catch (ex) {
                return {
                    address: "Lat: " + lat + ", Lon: " + lon,
                    postcode: 'geocoding error',
                    city: ex.message
                }
            }
        }
    });

});

