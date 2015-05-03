//var blank = "splash.png";
//var photoTaken = false;
var help = new Array();


getUserLanguage = function () {
  // Put here the logic for determining the user language

  return "it";
};


function initHelp() {
      help.push("Segnalare un'infrazione?");
      help.push("Attiva il GPS per abilitare la geolocalizzazione..");
      help.push("..Fai una foto alla presunta infrazione..");
      help.push("..Fai \"tap\" sulla foto per mascherare targhe e visi..");
      help.push("..Completa la scheda inserendo il tipo di segnalazione ed eventuali note..");
      help.push("..premi \"Multa\" ed è fatta!");
      

      Session.set("help",help);
      Session.set("currentHelp",0);

}
if (Meteor.isClient) {
  Meteor.subscribe("fines");
  Meteor.subscribe("userData");

    
    var userWasLoggedIn = false;
    Deps.autorun(function (c) {
        if(!Meteor.userId())
        {
            if(userWasLoggedIn)
            {
                console.log('Clean up');
                Session.set('isadmin', false);
            }
        }
        else
        {
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

      /*$('.navbutton').on("click", function(evt){
          console.log(evt);
          $('.button-collapse').sideNav('hide');
      });*/
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
 
    
/////////////////////////////////////
////////////// Navbar ///////////////
Template.navbar.rendered = function(){
    $('.modal-trigger').leanModal();
    $('.button-collapse').sideNav(); 
    $('collapsible').collapsible();
    initHelp();
};
    
Template.navbar.helpers({
    helpMessage: function() {
         var help = "";
         if(Session.get("help") && Session.get("help").length> Session.get("currentHelp")){
            help = Session.get("help")[Session.get("currentHelp")];
         }
        return help; 
    }
});

Template.navbar.events({
    "click #showHelp": function (event) {
        event.preventDefault();

        var currentHelp = Session.get("currentHelp");

        if (currentHelp < Session.get("help").length - 1) {
            currentHelp++;
        } else {
            currentHelp = 0;
        }

        Session.set("currentHelp", currentHelp);
    },
    "click #closeHelp": function (event) {
        event.preventDefault();

        currentHelp=0;
        Session.set("currentHelp", currentHelp);
    },
   "click #loginNav": function() {
        event.preventDefault();
        $('.button-collapse').sideNav('hide');
    },
    "click #logout": function(event) {
        $('.button-collapse').sideNav('show');
    }
});
    
/////////////////////////////////////
////////////// Main /////////////////
    
    Template.main.rendered = function(){
        Meteor.photoHandling.resetPicture();
        Meteor.geolocalization.geocode();
    };
    
    Template.main.helpers({
        city:function() {
            return Session.get("city");
        },
        address: function () {
            return Session.get("address");
        }, description: function () {
            return Session.get("description");
        }, photo: function () {
            return Session.get("photo");
        }, loc: function () {
            return Geolocation.latLng() || {
                lat: 0,
                lng: 0
            };
        },
        screen_name: function() {
            if( Meteor.user().services.facebook ) {
                return Meteor.user().services.facebook.name;
            }
            else if( Meteor.user().services.twitter ) {
                return Meteor.user().services.twitter.screenName;
            }
        },
        user: function() {
        return Meteor.user().profile.name;
        },
        userName: function() {
            var user = Meteor.user().username;
            console.log(user);
            if(!user){
                user = Meteor.user().profile.name;
            }

            return user;
        }, fines: function() {
           return Fines.find({}, {sort: {createdAt: -1}});

        },
         helpMessage: function() {
             var help = "";
             if(Session.get("help") && Session.get("help").length> Session.get("currentHelp")){
                help = Session.get("help")[Session.get("currentHelp")];
             }
            return help; 
        },
        error: Geolocation.error
    });
    
    Template.main.events({
        "click #send": function (event) {
        event.preventDefault();
        var text = $("#description").val();
        var address = $("#address").val();
        var city = Session.get("city");
        var lat = $("#lat").val();
        var lng = $("#lng").val();
        var category = $("#category").val();
            if(!category){
                category = "4";
            }
        var canvas = document.getElementById('canvas');
        //var imageData = $("#imgdata").val();
        var imageData = canvas.toDataURL();
//console.log("save fine. t:" + text + ", a:"+address+", city:"+city+",lat:"+lat+",lon:"+lng+",cat:"+category);
        Meteor.call("saveFine", text, address, city, lat, lng, category, imageData);

        // Clear form
/*
        Session.set("description", "");
        Session.set("photo", blank);
        Session.set("address", "");
*/
        $("#address").val("");
        $("#description").val("");
        $("#category").val("");
        $('select').material_select();
        $('body').scrollTop(0);
        Materialize.toast("Grazie per la segnalazione!", 3000 , 'rounded');
        Meteor.photoHandling.resetPicture();
        // Prevent default form submit (just in case)
        return false;
    },
    "click #login": function() {
        /*$('.button-collapse').sideNav('show');*/
        $('#login-sign-in-link').click();
        /*$('#login-username').focus();*/
    },
    "click #loginNav": function() {
            event.preventDefault();
            $('.button-collapse').sideNav('hide');
    },
    "click #logout": function(event) {
            $('.button-collapse').sideNav('show');
    },   
    "click #shoot": function(event) {
            Meteor.photoHandling.takePhoto();
    },
    "click #canvas": function (event) {
            if (!photoTaken) {
                Meteor.photoHandling.takePhoto();
            } else {
                Meteor.photoHandling.drawLogo('canvas',event.offsetX, event.offsetY);
            }
    }
    
});
    
/////////////////////////////////////
///////////// Body //////////////////
    
    Template.body.helpers({
     user: function() {
        return Meteor.user().profile.name;
     },
    userName: function() {
        var user = Meteor.user().username;
        console.log(user);
        if(!user){
            user = Meteor.user().profile.name;
        }
        
        return user;
    }, fines: function() {
       return Fines.find({}, {sort: {createdAt: -1}});
        
    },
     helpMessage: function() {
         var help = "";
         if(Session.get("help") && Session.get("help").length> Session.get("currentHelp")){
            help = Session.get("help")[Session.get("currentHelp")];
         }
        return help; 
    },
    error: Geolocation.error
  });

  Template.body.events({
    "click #login": function() {
        /*$('.button-collapse').sideNav('show');*/
        $('#login-sign-in-link').click();
        /*$('#login-username').focus();*/
    },
    "click #loginNav": function() {
        event.preventDefault();
        $('.button-collapse').sideNav('hide');
    },
    "click #logout": function(event) {
        $('.button-collapse').sideNav('show');
    },   
    "click #shoot": function(event) {
        Meteor.photoHandling.takePhoto();
    },
    "click #canvas": function (event) {
        if (!photoTaken) {
            Meteor.photoHandling.takePhoto();
        } else {
            Meteor.photoHandling.drawLogo('canvas', event.offsetX, event.offsetY);
        }
    },

    "click #showHelp": function (event) {
        event.preventDefault();
       
        var currentHelp = Session.get("currentHelp");

        if(currentHelp < Session.get("help").length-1) {
            currentHelp++;
        }  else {
            currentHelp = 0;
        }
        
        Session.set("currentHelp", currentHelp);
      },
    "click #closeHelp": function (event) {
        event.preventDefault();
    
        currentHelp=0;
        Session.set("currentHelp", currentHelp);
      }
  });
    
/////////////////////////////////////
Template.fineDetails.rendered = function(){

 var canvas = document.getElementById('myCanvas');
      var context = canvas.getContext('2d');
      var imageObj = new Image();

      imageObj.onload = function() {
        context.drawImage(imageObj, 0, 0,350,350);//,600,600);
      };
      imageObj.src = Session.get("detailImageData");
      console.log('isadmin' + Session.get("isadmin"));
     /* if(Session.get("isadmin") && !Session.get("isapproved")) {
         $(".adminThumb").show();
      } else {
         $(".adminThumb").hide();
      }*/
};

Template.fineDetails.events({
    
    "click #myCanvas": function (event) {
        if(Session.get("isadmin")/* && !Session.get("isapproved")*/){
           //drawLogo('myCanvas', event.offsetX, event.offsetY);
        }
     },
      "click .delete": function () {
//          console.log("id da cancellare " + Session.get("_id"));
        Meteor.call("deleteFine", Session.get("_id"), function(err){
            if(err)
                console.log(err);
            
            Router.go('/gestioneSegnalazioni');
        });
      },
        "click .thumb-up": function () {
        Meteor.call("approveFine",Session.get("_id"), function(err){
            if(err)
                console.log(err);
            
            Router.go('/gestioneSegnalazioni');
        });
      }
});
    
Template.fineDetails.helpers({
    createdAt: function(){
        return Session.get("createdAt");
    },
    username: function(){
        return Session.get("detailUsername");
    },
    _id:function(){
//        console.log("retrieving id from session:"+Session.get("_id"));
        return Session.get("_id");
    },
    isapproved:function() {
        return Session.get("isapproved");
    },
    text: function(){
        return Session.get("detailText");
    },
    address: function(){
        return Session.get("detailAddress");
    },
    category: function(){
        return Session.get("detailCategory");
    },
    imageData: function(){
        return Session.get("detailImageData");
    },
    isadmin: function() {
        return Session.get("isadmin");
    }
});
    
Template.fineToApprove.rendered = function() {
//    if(Session.get("isadmin")) {
//         $(".adminThumb").show();
//    } else {
//         $(".adminThumb").hide();
//    }
    
//    Meteor.call("isOwner", this.data._id, function (err, isOwner) {
//        var isAdmin = Session.get("isadmin");
//        if (err) {
//            if(isAdmin) {
//                $("#"+isOwner._id).show();
//            }else{
//                $("#"+isOwner._id).hide();
//            }
//        } else {
//            if(isOwner.result || isAdmin) {
//                $("#"+isOwner._id).show();
//            } else {
//                $("#"+isOwner._id).hide();
//            }
//        }
//    });
}

Template.fineToApprove.helpers({
    isadmin:function() {
        return Session.get("isadmin");
    }
});

Template.fineToApprove.events({
    "click .mini-shot":function(){
        console.log("clicked " + this._id);
        Session.set("_id", this._id);
        Session.set("createdAt", this.createdAt);
        Session.set("detailUsername", this.username);
        Session.set("detailText",this.text);
        Session.set("detailAddress",this.address);
        Session.set("detailCategory",this.category);
        Session.set("detailImageData",this.imageData);
        Session.set("isapproved", (this.approved==1?true:false));
        
        Router.go('/dettaglioSegnalazione');
    }
});

  Template.fine.events({
     "click .toggle-checked": function () {
        // Set the checked property to the opposite of its current value
        Tasks.update(this._id, {$set: {checked: ! this.checked}});
      },
      "click .delete": function () {
        Meteor.call("deleteFine", this._id);
      }
  });
    

 //////////////////////////////////////////
 ///////////////// admin //////////////////
    
function startupAdmin() {//TODO forse è il caso di usare Tracker
    //Se admin restituisci tutti  i fine non approvati
    //Se utente normale restituisci tutti i fine dell'utente non ancora approvati
    if(!Session.get("isadmin")){
     Meteor.call("isAdministrator", function (error, result) {
            if (error) {
                console.log("Error occurred: " + error);
                Session.set("isadmin",false);
            }
            // console.log("check is administrator:"+result);
            Session.set("isadmin",result);
      });
    }
     Meteor.call("findFinesByApproval", false, function (error, result) {
        if (error || !result) {
            console.log("Error in searching not approved fines." + error);
//            Session.set("finesToApprove", []);
        } else {
//            console.log("not approved list:" + result.toString());
            Session.set("finesToApprove", result);
        }
    });
};
    
Template.registerHelper('formatDate', function(date) {
  return moment(date).format('MM/DD/YYYY hh:mm');
});

Template.registerHelper('isadmin', function() {
    return Session.get("isadmin");
});

Template.admin.helpers({
    finesToApprove: function() {
        return Fines.find({approved:0}, {sort: {createdAt: -1}});            
    },
    latestFines: function() {
        return Fines.find({approved:1}, {sort: {createdAt: -1}});
//        return Session.get("latestFines");
    },
    hide:function(){
        return !Session.get("isadmin");
    }
});
 //////////////////////////////////////////
 
 //////////////////////////////////////////
 ////////// Ultime Segnalazioni ///////////
 
    Template.ultimeSegnalazioni.helpers({
        fines: function () {
            return Fines.find({}, {
                sort: {
                    createdAt: -1
                }
            });
        }
    }); 
    
 //////////////////////////////////////////
    
 //////////////////////////////////////////
 ///////// cercaSegnalazioni //////////////

Template.listaSegnalazioni.helpers({
    foundfines: function () {
        return Session.get("foundfines");
    }
});
    
Template.listaSegnalazioni.events({
"click #resetFines": function(event){
        event.preventDefault();
        
        Session.set("foundfines",[]);
    },
    "click #getFines":function(event) {
        event.preventDefault();
        var filter = $("input[type='radio'][name='group1']:checked").val();
        
        var coords = Geolocation.latLng();
//        console.log("coords:" + JSON.stringify(coords));
        var maxD = $("#maxD").val()?$("#maxD").val():1000;
        var minD = $("#minD").val()?$("#minD").val():0;
        var lat = coords.lat;
        var lon = coords.lng;
        
        if(filter == "0"){ //all
            /* Fines più vicini ed ordinati per data */
            Meteor.call("findNearUserFine", true, lat, lon, minD,maxD, function(error,result) {
                if(error || !result) {
                    console.log("Error in searching fines." + error);
                    Session.set("foundfines",[]);
                }else {
                    console.log("found something.. " + result);
                    Session.set("foundfines",result);
                }
            });
         } else if (filter == "1") {//nearest. do not order by date
            Meteor.call("findNearUserFine", false, lat, lon, minD, maxD, function (error, result) {
                if (error || !result) {
                    console.log("Error in searching fines." + error);
                    Session.set("foundfines", []);
                }else {
                    Session.set("foundfines", result);
                }
            });    
         } else if (filter == "2") {//latest
            /* Fines più recenti */
            Meteor.call("findLatestFines", function(error,result) {
                if(error || !result) {
                    console.log("Error in searching fines." + error);
                    Session.set("foundfines",[]);
                } else {
                    Session.set("foundfines",result);
                }
            });
         }
    }
});
    
    //////////////////////////////////////////
    // At the bottom of the client code
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

}
