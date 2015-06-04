
function setupCronJob() {
    SyncedCron.add({
      name: 'FinesArchiving',
      schedule: function(parser) {
        return parser.text('every 2 hours');
      },
      job: function() {
//        finesArchiving();
      }
    });
}

function finesArchiving() {
    //Archive fines here
    var archivingException = false;

    //Step 1: Retrieve fines older then 24 hours starting from now -> check moment
    var nowMoment = moment();
    var oldFinesMoment = nowMoment.subtract(24, "hours");
//    console.log("old fines moment " + oldFinesMoment.format());
    var selector   = { createdAt:{ $lte: new Date(oldFinesMoment.format()) }};
    //TODO - REMOVE images?
//    var projection = { fields: { imageData:0 }};
    var oldFinesCursor = Fines.find( selector);//, projection);

    //Step 2: Use collected fines ids to save on a separate collection
    oldFinesCursor.forEach(function(fine){
        var currentId = fine._id;

        console.log("Archiving fine: " + fine._id);
        if(fine.likes && !(typeof fine.likes != 'undefined')) {
            console.log("archiving likes " + fine.likes.count);
            fine.likecount = fine.likes.length;
        } else {
            fine.likecount = 0;
        }

        fine.originalId = {};
        fine.originalId = fine._id;//Original id is saved, new collection id is demanded to mongo
        delete fine["_id"];
        delete fine["likes"];

        try {
            //Archive fine without image?
            var result = History.insert(fine);
            console.log("Archiving fine, result:"+result);
        } catch(ex) {
            console.log("Cannot archive fine: " + ex.message);
            archivingException = true;
        }

        //Step 3: Remove collected ids from fines collection
        if(!archivingException){
            try {
                Fines.remove({ _id:currentId });
            } catch(ex) {
                console.log("Cannot remove online fine: " + ex.message);
                archivingException = true;
            }
        }
        archivingException = false;
    });
};


function setupInitialData() {

    function updateApproved() {
        Fines.update({ approved:0 },{ $set: { approved: false }}, { multi: true}, function(err,res){ console.log("err: " +err + ", for approved=0 updated rows: " + res); });
        Fines.update({ approved:1 },{ $set: { approved: true }}, { multi: true}, function(err,res){ console.log("err: " +err + ", for approved=1 updated rows: " + res); });
    }

    function updateLikes() {
        Fines.update({ likes:{ $exists:false }},{ $set:{ likes:[] }}, { multi: true });
    }

    updateApproved();
    updateLikes();

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

    addCategory('PRC', 'Sosta in divieto');
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

    // requires package meteorhacks:inject-initial
    // but it has been replaced by head.html
    //Inject.meta("viewport", "width=device-width, initial-scale=1");

    ROOT_URL = process.env.ROOT_URL;

    console.log("ROOT_URL=" + ROOT_URL);
    console.log("env.ROOT_URL=" + process.env.ROOT_URL);
    console.log("env.MOBILE_ROOT_URL=" + process.env.MOBILE_ROOT_URL);


    setupInitialData();
    setupCronJob();

    Restivus.configure({
      useAuth: false,
      prettyJson: true,
      enableCors: true
    });

    Meteor.publish("fines", function () {
        return Fines.find({
                createdAt: { $gte: Common.yesterday() }
            },
            { fields: {imageData: 0}},
            { sort: {createdAt: -1}
        });
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
                'username': 1,
                'services.twitter.profile_image_url': 1,
//                    'services.facebook':1,
                'services.facebook.email':1,
                'services.facebook.picture':1,
                'services.google.email':1,
                'services.google.picture':1,
                'services.google.locale':1
            }
        });
    });
    /* Google service schema */
    /*
    "{
        "accessToken":"",
        "idToken":"",
        "expiresAt":,
        "id":"",
    ->  "email":"youremail@gmail.com",
        "verified_email":true,
        "name":"Name Surname",
        "given_name":"",
        "family_name":"",
    ->  "picture":"https://",
    ->  "locale":"it/en/..",
        "gender":"male/female"
    } */

    function isAdministrator() {
        var cu = userUtils.getCurrentUsernameService();

        var username = cu.username;
        var service  = cu.service;

        //var userAdm = Administrators.find({"username":username},{limit:1}).fetch()[0];
        var userAdm = Administrators.findOne({$and:[{username: username},{service:service}]});

        if (Meteor.user().services.password) {
            userAdm = Meteor.user();
        }
        //    console.log("userAdm " + JSON.stringify(userAdm)+" looking for "+username);

        if (!userAdm) {
//            console.log(username + " is not admin");
            return false;
        } else {
//            console.log(username + " is  admin!!!!");
            return true;
        }
    };

    Meteor.methods({
//            isAdministrator: function () {
//                return isAdministrator();
//            },
        getStatistics: function() {
            var pipeline = [{
                $group: {
                    _id: "$category",
                    count: { $sum: 1}
                }
            }, {
                $sort: {count: -1}
            }];
            var result = Fines.aggregate(pipeline);
            return result;
        },
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
            if(Meteor.user() && fineId) {
                var username = userUtils.getCurrentUsername();
                //console.log("User "+username +" said: I " + (like==true?"like":"don't like") +  " fine "+fineId);
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
        // not working
        iLikeThis: function(fineId) {

            if(Meteor.user() && fineId) {
                var username = userUtils.getCurrentUsername();

                var match    = { $match: { _id:fineId, likes: { $in: [username.toString()] }}};
                var group    = { $group: { _id:"$_id", count: { $sum:1 }}};
                var project  = { $project: { _id:0, count:1 }};
                var pipeline = [ match, group, project ];

                var gotIt    = Fines.aggregate(pipeline);

                if(gotIt && gotIt.length > 0) {
//                    console.log("returning " + gotIt[0].count + " > 0");
                    return gotIt[0].count > 0;
                }
            }

            return false;
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
        deleteFine: function (fineId) {
            if(fineId && isAdministrator()) { //Se amministratore, è possibile rimuovere la segnalazione
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
        reverseGeocode: function (lat, lng) {
            this.unblock();
            try {
                var obj = HTTP.get("http://nominatim.openstreetmap.org/reverse",
                                   { params: {
                                         format: "json",
                                         lat: lat,
                                         lon: lng
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
                        address: "Lat: " + lat + ", Lng: " + lng,
                        postcode: 'geocoding error',
                        city: obj.statusCode
                    }
                }
            } catch (ex) {
                return {
                    address: "Lat: " + lat + ", Lng: " + lng,
                    postcode: 'geocoding error',
                    city: ex.message
                }
            }
        }
    });
});
