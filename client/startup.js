var finesSubscription = Meteor.subscribe("fines");
Meteor.subscribe("categories");
Meteor.subscribe("userData");
    
var userWasLoggedIn = false;

Tracker.autorun(function () {
  var coords = Geolocation.latLng();

    if (coords && coords.lat && coords.lng) {
        Session.set("lat",coords.lat);
        Session.set("lon",coords.lng);
        console.log("coords  " + JSON.stringify(coords));
    }
});


Tracker.autorun(function () {
    if( finesSubscription.ready()) {
        console.log("done loading fines");
//        console.log($('.spinner-layer'));
        $('.preloader-wrapper.active').hide();
    }
});

/* maybe it should become main.js? */
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

      photoHandling.resetPicture();
  });
