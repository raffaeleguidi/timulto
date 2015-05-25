var services = ["facebook","twitter","google"];

userUtils = {
    getCurrentUsername: function() {
        var username = "";
        if(Meteor.user()) {
            if (Meteor.user().services.facebook) {
                username = Meteor.user().services.facebook.email;
            } else if (Meteor.user().services.twitter) {
                username = Meteor.user().services.twitter.screenName;
            } else if (Meteor.user().services.google) {
                username = Meteor.user().services.google.email;
            } else {
                username = Meteor.user().username;
            }
        }

        return username;
    },
    getCurrentUsernameService: function() {
        var username = "";
        var service = "";

        if (Meteor.user()) {
            if (Meteor.user().services.facebook) {
                username = Meteor.user().services.facebook.email;
                service  = "facebook";
            } else if (Meteor.user().services.twitter) {
                username = Meteor.user().services.twitter.screenName;
                service  = "twitter";
            } else if (Meteor.user().services.google) {
                username = Meteor.user().services.google.email;
                service  = "google";
            } else if (Meteor.user().services.password) {
                username = Meteor.user().username;
                service  = "password";
            }
        }

        return {
            username: username,
            service: service
        };
    },
    getSupportedServices: function() {
        return services;
    },
    isLoggedIn: function() {
        if (Meteor.user())
            return true;
        else
            return false;
    }
}
