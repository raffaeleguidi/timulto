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
            Meteor.geolocalization.geocode();
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