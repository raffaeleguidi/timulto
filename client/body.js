/////////////////////////////////////
///////////// Body //////////////////

Template.body.helpers({
    userName: function () {
        var user = Meteor.user().username;
        console.log(user);
        if (!user) {
            user = Meteor.user().profile.name;
        }

        return user;
    },
    fines: function () {
        return Fines.find({}, {
            sort: {
                createdAt: -1
            }
        });

    },
    helpMessage: function () {
        var help = "";
        if (Session.get("help") && Session.get("help").length > Session.get("currentHelp")) {
            help = Session.get("help")[Session.get("currentHelp")];
        }
        return help;
    },
    error: Geolocation.error
});

Template.body.events({
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
    },

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

        currentHelp = 0;
        Session.set("currentHelp", currentHelp);
    }
});
