Fines = new Mongo.Collection("fines");
Administrators = new Mongo.Collection("administrators");

function isAdministrator() {
    var username = "";
//    console.log("#isAdministrator: " + JSON.stringify(Meteor.user()));
    
    if(Meteor.user()) {
        if( Meteor.user().services.facebook ) {
            username = Meteor.user().services.facebook.email;
        }
        else if( Meteor.user().services.twitter ) {
            username = Meteor.user().services.twitter.screenName;
        }
        //console.log(username);
    }

    var userAdm = Administrators.findOne({username:username});

    if(!userAdm) {
        console.log(username + " is not admin");
       return false;
    } else {
        console.log(username + " is  admin!!!!");
        return true;
    }
};

Meteor.methods({
    isOwner:function(fineId){
        if(Meteor.userId()) {
            var userId = Meteor.userId();

            var owner = Fines.findOne(fineId,{fields:{"owner":1}})
            if(owner) {
                owner = owner.owner;
//                console.log("owner: "+ owner + " compared to current "+userId);
//                console.log("@MeteorMethod#isOwner: fine " + fineId + ", found owner: " + owner + " , user "+Meteor.userId());
            
                var obj=  {result:(owner == userId), _id:fineId};
                
//                console.log(JSON.stringify(obj));
                
                return obj;
            }
        }
        
        return {result:false, _id:fineId};
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

        Fines.insert({
          text: text,
          address: address,
          city:city,
          loc:{type:"Point",coordinates:[parseFloat(lng),parseFloat(lat)]},
          category: category,
          approved:0,
          imageData: imageData,
          owner: Meteor.userId(),
          username: Meteor.user().profile.name,
          createdAt: new Date() // current time
        });

    },
    approveFine: function(fineId) {
        
        if(isAdministrator()) {
            Fines.update({"_id":fineId},{$set:{"approved":1}});
        } else {
             console.log("User is not an administrator: "+ JSON.stringify(Meteor.user().profile.name));
        }
    },
    deleteFine: function (fineId) {//TODO da aggiungere la logica che controlla se l'utente è admin o l'utente corrente "possiede" il fine

        if(isAdministrator()) { //Se amministratore, è possibile rimuovere la segnalazione
            Fines.remove(fineId);
        } else{
            var res = Fines.findOne(fineId);
            
            if(res && res.owner == Meteor.userId()) {//se l'utente corrente ha creato la segnalazione può anche rimuoverla
                Fines.remove(fineId);
            } else {
                console.log("User is not an administrator and does not own the fine: "+ JSON.stringify(Meteor.user().profile.name));
            }
        }
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
//           console.log("lat is not nan");
            lat = parseFloat(latitude);
           }
        var lon = 0.0;
        if(longitude){
//           console.log("lon is not nan");
            lon = parseFloat(longitude);
           }
        var minD = 0.0;
        if(minDistance && minDistance > 0){
//           console.log("minD is not nan");
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
//        var curEl = null;
        var currentUsername = Meteor.userId()?  Meteor.user().profile.name:"";

        if(cursor){
            cursor.forEach(function (doc) {
//                console.log(doc._id + ":" + doc.createdAt);

//                curEl = Fines.findOne({_id:doc._id});
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
//        var curEl = null;
        var currentUsername = Meteor.userId()?  Meteor.user().profile.name:"";

        if(cursor){
            cursor.forEach(function (doc) {
//                console.log(doc._id + ":" + doc.createdAt);

//                curEl = Fines.findOne({_id:doc._id});
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
//        var curEl = null;
//        var currentUsername = Meteor.user()?  Meteor.user().profile.name:"";

        if(cursor){
            cursor.forEach(function (doc) {
//                console.log("Not approved--> "+ doc._id + ":" + doc.createdAt+"."+doc.approved);
                finalResult.push(doc);
            });
        }
        
        return finalResult;
    },
});

if(Meteor.isCordova){
    Meteor.startup(function(){
        document.addEventListener("backbutton", function() {
            if (document.location.pathname == "/"){
                navigator.app.exitApp();
            } else {
                history.go(-1)
            }
        });

        window.onpopstate = function () {
            if (history.state && history.state.initial === true){
                navigator.app.exitApp();

                //or to suspend meteor add cordova:org.android.tools.suspend@0.1.2
                //window.plugins.Suspend.suspendApp();
            }
        };
    });
}
