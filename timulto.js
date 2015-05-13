Fines = new Mongo.Collection("fines");
Administrators = new Mongo.Collection("administrators");
Categories = new Mongo.Collection("categories");

if(Meteor.isCordova){

    Meteor.startup(function(){
        /*
        console.log("device.name " + device.name);
        console.log("device.cordova " + device.cordova);
        console.log("device.platform " + device.platform);
        console.log("device.uuid " + device.uuid);
        console.log("device.version " + device.version);
        console.log("device.model " + device.model);

        // output on android emulator:
        I20150511-15:47:35.753(2) (android:http://meteor.local/timulto.js:12) device.name undefined
        I20150511-15:47:35.868(2) (android:http://meteor.local/timulto.js:13) device.cordova 3.6.4
        I20150511-15:47:35.868(2) (android:http://meteor.local/timulto.js:14) device.platform Android
        I20150511-15:47:35.868(2) (android:http://meteor.local/timulto.js:15) device.uuid ac20ff2e59fe24ad
        I20150511-15:47:35.868(2) (android:http://meteor.local/timulto.js:16) device.version 4.4.2
        I20150511-15:47:35.869(2) (android:http://meteor.local/timulto.js:17) device.model Android SDK built for x86
        */
        document.addEventListener("deviceready", function() {
            try  {
                Session.set("platform", device.platform + " v" + device.version);
                Session.set("os", device.platform);

                if (false && device.platform == "Android" && device.version >= "4.2.0") {
                    Ground.Collection(Fines);
                    Ground.Collection(Categories);
                    Ground.Collection(Administrators);
                    console.log("HW requirements are met: offline support enabled");
                } else {
                    console.log("HW requirements not met: offline support disabled");
                }
            } catch(ex) {
                Session.set("platform", "unknown: " + ex.message);
            }
        }, false);

        document.addEventListener("backbutton", function() {
            /*if (document.location.pathname == "/" || document.location.pathname == "/home"){
                navigator.app.exitApp();
            } else if( document.activeElement.className === "button-collapse" && document.activeElement.tagName.toUpperCase() === "A" ) {//close navbar on mobile
                document.activeElement.click();
            } else {
                history.go(-1);
            };*/
            if (depth > 0)
                history.back();
            else
                navigator.app.exitApp();
        });
    });
}
function isAdministrator() {
    var username = "";
    var service = "";

    if(Meteor.user()) {
        if (Meteor.user().services.facebook) {
            username = Meteor.user().services.facebook.email;
            service  = "facebook";
        } else if (Meteor.user().services.twitter) {
            username = Meteor.user().services.twitter.screenName;
            service  = "twitter";
        } else if (Meteor.user().services.google) {
            username = Meteor.user().services.google.email;
            service  = "google";
        }
    }
//    console.log("username : " + username + ", service " + service);

    var userAdm = Administrators.findOne({$and:[{username:username},{service:service}]});

    if (Meteor.user().services.password) {
        console.log('with local password everyone is admin');
        return true;
    }

    if(!userAdm) {
//        console.log(username + " is not admin");
       return false;
    } else {
//        console.log(username + " is  admin!!!!");
        return true;
    }
};

Meteor.methods({
    getCategoriesValues: function() {
        return Meteor.wrapAsync(Categories.find({}).fetch());
    },
    isOwner:function(fineId){
        if(Meteor.userId()) {
            var userId = Meteor.userId();

            var owner = Fines.findOne(fineId,{fields:{"owner":1}})
            if(owner) {
                var obj =  {
                    result:(owner.owner == userId),
                    _id:fineId
                };

                return obj;
            }
        }

        return {
            result:false,
            _id:fineId
        };
    },
    isAdministrator: function(){
        return isAdministrator();
    },
    saveFine: function (text, address, city, lat, lng, category, imageData) {
        // Make sure the user is logged in before inserting a task
        if (! Meteor.userId()) {
          throw new Meteor.Error("not-authorized");
        }

        var username = '';

        try {
            username = Meteor.user().profile.name;
        } catch (ex) {
            console.log('falling back to username for simple password auth');
            username = Meteor.user().username;
        }

//        if( !address || address === "" || !category || category === "" || !imageData || imageData === "") {
//          throw new Meteor.Error("cannot insert empty fine.");
//        }
        var approved = false;

        if(isAdministrator()){
            approved = true;
        }
        console.log("inserted element " + Fines.insert({
          text: text,
          address: address,
          city:city,
          loc:{type:"Point",coordinates:[parseFloat(lng),parseFloat(lat)]},
          category: category,
          approved:approved,
          imageData: imageData,
          owner: Meteor.userId(),
          username: username,
          createdAt: new Date() // current time
        }));

    },
    setChecked: function (fineId, setChecked) {
        //Fines.update(taskId, { $set: { checked: setChecked} });
    },
    findNearUserFine: function(orderbydate, latitude, longitude, minDistance, maxDistance) {
        //Con la seguente query vengono restituite tutte le segnalazioni in prossimità delle coordinate specificate e che siano approved=true se di altri utenti, o anche approved=false se sono dell'utente corrente. La discriminante più forte è la vicinanza che potrebbe non includere le segnalazioni dell'utente corrente
//        console.log("Calling findNearUserFine. Lat:" + latitude + " parsed " +parseFloat(latitude)+
//                    ",lon:"+longitude+" parsed " +parseFloat(longitude)+
//                    ", maxD:"+maxDistance+" minD:"+minDistance);
        var lat = 0.0;
        if(latitude){
            lat = parseFloat(latitude);
        }

        var lon = 0.0;
        if(longitude){
            lon = parseFloat(longitude);
        }

        var minD = 0.0;
        if(minDistance && minDistance > 0){
            minD = parseFloat(minDistance);
        }

        var cursor = Fines.find({
            loc:{
                $near:{
                    $geometry:{
                        type:"Point",
                        coordinates:[lon, lat ]
                    },
                    $minDistance:minD,
                    $maxDistance:parseFloat(maxDistance),
                    }
                }
        },
            {_id:1});

        var finalResult = new Array();
        var currentUsername = Meteor.userId()?  Meteor.user().profile.name:"";

        if(cursor){
            cursor.forEach(function (doc) {
                if(doc && ( doc.approved || doc.username ==  currentUsername )){
                    console.log(doc._id+":"+doc.createdAt+", user:"+doc.username+",approved:"+doc.approved);
                    finalResult.push(doc);
                }
            });
        }

        if(finalResult.length>1 && orderbydate==true){
                finalResult.sort(function(a, b){
                    var keyA = new Date(a.createdAt),
                    keyB = new Date(b.createdAt);
                    // Compare the 2 dates
                    if(keyA < keyB) return 1;
                    if(keyA > keyB) return -1;
                    return 0;
                });
            }

        return finalResult;
    },
    findLatestFines: function() {
        var cursor = Fines.find({},{ sort:{createdAt:-1}});

        var finalResult = new Array();
        var currentUsername = Meteor.userId()?  Meteor.user().profile.name:"";

        if(cursor){
            cursor.forEach(function (doc) {
                if(doc && doc.approved ){// || doc.username ===  currentUsername)){
                    console.log(doc._id+":"+doc.createdAt+", user:"+doc.username+",approved:"+doc.approved);
                    finalResult.push(doc);
                }
            });
        }

        return finalResult;
    },
    findFinesByApproval: function(approved) {
        var filter = true;

        if(approved == false || approved == 0) {
            filter = false;
        }
        var cursor;


        if(isAdministrator()) {
            cursor = Fines.find({approved:filter},{ sort:{createdAt:1}});
        } else {
            cursor = Fines.find({$and:[{approved:filter},{owner:Meteor.userId()}]},{ sort:{createdAt:1}});
        }
        var finalResult = new Array();

        if(cursor){
            cursor.forEach(function (doc) {
                finalResult.push(doc);
            });
        }

        return finalResult;
    },
});

