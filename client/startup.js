var finesSubscription = Meteor.subscribe("fines");
Meteor.subscribe("categories");
Meteor.subscribe("userData");
    

Tracker.autorun(function() {
    if(finesSubscription.ready()) {
        Session.set("finesLoaded", true);
    }
});
var minuteInMillis = 1000 * 60;

if(Meteor.isCordova && (Session.get("os") == "Android")) {
    //Every 5 minutes check whether or not the application is being used
    Meteor.setInterval(function () {
        var lastUsed = Session.get("lastUsed");
        if(lastUsed) {
            lastUsed = moment(lastUsed);
            var now = moment();
            var fiveMinutes = 5;
            var lastUsedPlusFive = lastUsed.add(fiveMinutes, "minutes");
//            console.log("lastUsedPlusFive was 5 minutes ago? " + (now.diff(lastUsedPlusFive) >= 0));
//            console.log("last used: " + lastUsed + ", now: " + now.toString());
            if( now.diff(lastUsedPlusFive) >= 0 ) {
                navigator.app.exitApp();
            }
        }
    }, minuteInMillis * 5);
}

/* maybe it should become main.js? */
var userWasLoggedIn = false;

Tracker.autorun(function () {
    if(!Meteor.userId()){
        if(userWasLoggedIn){
            Session.set('isadmin', false);
        }
    }
    else {
        Meteor.call("isAdministrator", function (error, result) {
        if (error) {
            console.log("Error occurred: " + error);
            Session.set("isadmin",false);
        }
        Session.set("isadmin",result);
        });
        userWasLoggedIn = true;
    }
});
    
function loadCategories () {
$.get("/api/categories", function(data){
    Session.set("categories", data);
});
}

  Meteor.startup(function(){

      depth = 0;

      Meteor.call("rootUrl", function(err, res){
        if (err) {
            console.log("error "+err);
        }
        Session.set("rootUrl", res)
      });

      TAPi18n.setLanguage(getUserLanguage())
          .done(function () {
            Session.set("showLoadingIndicator", false);
          })
          .fail(function (error_message) {
            // Handle the situation
            console.log(error_message);
          });      
      

      $('select').material_select();

      Session.set("foundfines",[]);
      Session.set("finesToApprove",[]);

      var startupMoment = moment();
      console.log("[" + startupMoment + "] Starting up ... ");
      Session.set("lastUsed", startupMoment);

      photoHandling.resetPicture();
  });
