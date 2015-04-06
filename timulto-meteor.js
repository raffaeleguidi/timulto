Fines = new Mongo.Collection("fines");

Meteor.methods({
    "saveFine": function (text, address, lat, lng, category, imageData) {
        // Make sure the user is logged in before inserting a task
        /*if (! Meteor.userId()) {
          throw new Meteor.Error("not-authorized");
        }*/

        Fines.insert({
          text: text,
          address: address,
          lat: lat,
          lng: lng,
          category: category,
          imageData: imageData,
          createdAt: new Date() // current time
        });

    },
    deleteFine: function (fineId) {
        Fines.remove(fineId);
    },
    setChecked: function (fineId, setChecked) {
        //Fines.update(taskId, { $set: { checked: setChecked} });
    }
});

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
