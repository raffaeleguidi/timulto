
getUserLanguage = function () {
  // Put here the logic for determining the user language

  return "it";
};



/////////////////////////////////////
////////////// Crea /////////////////

Template.crea.rendered = function () {
    Meteor.photoHandling.resetPicture();
};

Template.crea.helpers({
    address: function() {
        return Session.get("address");
    },
    description: function () {
        return Session.get("description");
    },
    photo: function() {
        return Session.get("photo");
    },
    loc: function() {
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

Template.crea.events({
    "click #send": function (event) {
        event.preventDefault();
        var text = $("#description").val();
        var address = $("#address").val();
        var city = Session.get("city");
        var lat = $("#lat").val();
        var lng = $("#lng").val();
        var category = $("#category").val();
        if (!category) {
            category = "4";
        }

        var canvas = null;
        try {
            canvas = document.getElementById('canvas');
        } catch(ex) {
            //noop
        }
        var imageData = canvas.toDataURL();

        Meteor.call("saveFine", text, address, city, lat, lng, category, imageData);

        Meteor.photoHandling.resetPicture();
        //Meteor.geolocalization.geocode();

        $("#address").val(Session.get("address"));
        $("#description").val("");
        $("#category").val("");
        $('select').material_select();
        $('body').scrollTop(0);
        Materialize.toast("Grazie per la segnalazione!", 3000, 'rounded');

        return false;
    },
    "click #login": function () {
        /*$('.button-collapse').sideNav('show');*/
        $('#login-sign-in-link').click();
        /*$('#login-username').focus();*/
    },
    "click #loginNav": function () {
        event.preventDefault();
        $('.button-collapse').sideNav('hide');
    },
    "click #logout": function (event) {
        $('.button-collapse').sideNav('show');
    },
    "click #shoot": function (event) {
        Meteor.photoHandling.takePhoto();
    },
    "click #canvas": function (event) {
        if (!Meteor.photoHandling.photoTaken()) {
            Meteor.photoHandling.takePhoto();
        } else {
            Meteor.photoHandling.drawLogo('canvas', event.offsetX, event.offsetY);
        }
    }

});



//////////////////////////////////////////
// At the bottom of the client code
Accounts.ui.config({
passwordSignupFields: "USERNAME_ONLY"
});


