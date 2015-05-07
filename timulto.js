Fines = new Mongo.Collection("fines");
Administrators = new Mongo.Collection("administrators");
Categories = new Mongo.Collection("categories");

Ground.Collection(Fines);
Ground.Collection(Administrators);
Ground.Collection(Categories);

function isAdministrator() {
    var username = "";
    var service = "";

    if(Meteor.user()) {
        if( Meteor.user().services.facebook ) {
            username = Meteor.user().services.facebook.email;
            service  = "facebook";
        }
        else if( Meteor.user().services.twitter ) {
            username = Meteor.user().services.twitter.screenName;
            service  = "twitter";
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
    isAdministrator:function(){
//        console.log("@MeteorMethod#isAdministrator: ");
        return isAdministrator();
    },
    "saveFine": function (text, address, city, lat, lng, category, imageData) {
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
//
//        }
        var approved = 0;

        if(isAdministrator()){
            approved = 1;
        }
        Fines.insert({
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
        });

    },
    setChecked: function (fineId, setChecked) {
        //Fines.update(taskId, { $set: { checked: setChecked} });
    },
    findNearUserFine: function(orderbydate, latitude, longitude, minDistance, maxDistance) {
        //Con la seguente query vengono restituite tutte le segnalazioni in prossimità delle coordinate specificate e che siano approved=1 se di altri utenti, o anche approved=0 se sono dell'utente corrente. La discriminante più forte è la vicinanza che potrebbe non includere le segnalazioni dell'utente corrente
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
                if(doc && ((doc.approved == 1 ) || doc.username ==  currentUsername)){
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
                if(doc && (doc.approved == 1 )){// || doc.username ===  currentUsername)){
                    console.log(doc._id+":"+doc.createdAt+", user:"+doc.username+",approved:"+doc.approved);
                    finalResult.push(doc);
                }
            });
        }

        return finalResult;
    },
    findFinesByApproval: function(approved) {//TODO da aggiungere la logica che controlla se l'utente è admin
        var filter = 1;

        if(approved == false || approved == 0) {
            filter = 0;
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

if(Meteor.isCordova){
    Meteor.startup(function(){
        document.addEventListener("backbutton", function() {
            /*if (
                document.location.pathname == "/chisiamo" ||
                document.location.pathname == "/mappaSegnalazioni" ||
                document.location.pathname == "/gestioneSegnalazioni"
               ) {
                    document.location.pathname ="/";
            } else if (document.location.pathname == "/dettaglioSegnalazione") {
                    document.location.pathname = "/gestioneSegnalazioni";
            } else if ( document.location.pathname == "/" || document.location.pathname == "/home") {
                   navigator.app.exitApp();
            };*/
            if (document.location.pathname == "/" || document.location.pathname == "/home"){
                navigator.app.exitApp();
            } else if( document.activeElement.className === "button-collapse" && document.activeElement.tagName.toUpperCase() === "A" ) {//close navbar on mobile
                document.activeElement.click();
            } else {
                history.go(-1);
            };
        });

        /*window.onpopstate = function () {
            if (history.state && history.state.initial === true){
                navigator.app.exitApp();

                //or to suspend meteor add cordova:org.android.tools.suspend@0.1.2
                //window.plugins.Suspend.suspendApp();
            }
        };*/
    });
}
