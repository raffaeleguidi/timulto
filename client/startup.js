Meteor.subscribe("fines");
Meteor.subscribe("userData");
    
var userWasLoggedIn = false;

Deps.autorun(function (c) {
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
        // console.log("check is administrator:"+result);
        Session.set("isadmin",result);
        });
        userWasLoggedIn = true;
        //Meteor.geolocalization.geocode();
    }
    });
    
  Meteor.startup(function(){

//      console.log(TAPi18n.getLanguage());
      TAPi18n.setLanguage(getUserLanguage())
          .done(function () {
            Session.set("showLoadingIndicator", false);
          })
          .fail(function (error_message) {
            // Handle the situation
            console.log(error_message);
          });      
      
      $('select').material_select();
//      $(".button-collapse").sideNav();
//      $('.modal-trigger').leanModal();

      Session.set("foundfines",[]);
      Session.set("finesToApprove",[]);
      Meteor.photoHandling.resetPicture();
      
      GoogleMaps.load();
      //T9n.setLanguage('it');//Set language
      
//      Meteor.call("isAdministrator", function (error, result) {
//            if (error) {
//                console.log("Error occurred: " + error);
//                Session.set("isadmin",false);
//            }
//            // console.log("check is administrator:"+result);
//            Session.set("isadmin",result);
//      });
  });

//
//function startupAdmin() {//TODO forse è il caso di usare Tracker
//    //Se admin restituisci tutti  i fine non approvati
//    //Se utente normale restituisci tutti i fine dell'utente non ancora approvati
//    if(!Session.get("isadmin")){
//     Meteor.call("isAdministrator", function (error, result) {
//            if (error) {
//                console.log("Error occurred: " + error);
//                Session.set("isadmin",false);
//            }
//            // console.log("check is administrator:"+result);
//            Session.set("isadmin",result);
//      });
//    }
//     Meteor.call("findFinesByApproval", false, function (error, result) {
//        if (error || !result) {
//            console.log("Error in searching not approved fines." + error);
////            Session.set("finesToApprove", []);
//        } else {
////            console.log("not approved list:" + result.toString());
//            Session.set("finesToApprove", result);
//        }
//    });
//};
