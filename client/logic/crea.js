/////////////////////////////////////
////////////// Crea /////////////////

getUserLanguage = function () {
  // Put here the logic for determining the user language
  return "it";
};


Template.crea.created = function () {
    depth = 1;
}

Template.crea.rendered = function () {
    photoHandling.resetPicture();
    if (Meteor.isCordova) {
        photoHandling.takePhoto();
    }

    var now = moment();
    Session.set("lastUsed", now.toString());
};

Template.crea.helpers({
     disabled: function() {
       return !(Session.get("address")!="" && Session.get("isphototaken")); // && Session.get("categoryselected"));
    },
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
        else if (Meteor.user().services.google) {
            return Meteor.user().services.google.email;
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
    "change #category":function(event) {
        console.log("set category");
        Session.set("categoryselected", true);
    },
    "click #send": function (event) {
        event.preventDefault();
        var text = $("#description").val();
        var address = $("#address").val();
        var city = Session.get("city");
        var county = Session.get("county");
        var postcode = Session.get("postcode");
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

        Meteor.call("saveFine", text, address, city, county, postcode, lat, lng, category, imageData);

        /*photoHandling.resetPicture();
        Session.set("categoryselected",false);*/

        $("#address").val(Session.get("address"));
        $("#description").val("");
        $("#category").val("");
        $('select').material_select();
        $('body').scrollTop(0);

        Router.go("/");

        Materialize.toast("Grazie per la segnalazione", 4000, 'rounded center');

        setTimeout(function() {
            $(".mini-shot").each( function () {
                var src = $( this ).attr("src");
                $( this ).attr("src", "/icon.png");
                $( this ).attr("src", src);
                console.log("refreshed src=%s", src);
            });
            setTimeout(function() {
                $(".mini-shot").each( function () {
                    var src = $( this ).attr("src");
                    $( this ).attr("src", "/icon.png");
                    $( this ).attr("src", src);
                    console.log("refreshed src=%s", src);
                });
            }, 1000);
        }, 1000);

        GAnalytics.event("segnalazione","inviata");
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
        photoHandling.takePhoto();
        //geolocalization.geocode();
    },
     "click #manualgeocode": function (event) {
        console.log("manual geocode");
        geoLocalization.geocode();
        console.log("manual geocode end");
    },
    "click #canvas": function (event) {
        if (!photoHandling.photoTaken()) {
            photoHandling.takePhoto();
        } else {
            photoHandling.drawLogo('canvas', event.offsetX, event.offsetY);
        }
    }

});



//////////////////////////////////////////
// At the bottom of the client code
Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
});


