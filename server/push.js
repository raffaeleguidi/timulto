Meteor.startup(function () {
    Meteor.methods({
        registerId: function(regid) {
            // save it for later reuse
            console.log("should register client: %s for user: %s", regid, Meteor.userId());
        },
        sendMessage: function(user) {
            // save it for later reuse
            console.log("should send a message to: %s sent from: %s", user, Meteor.userId());
            return { sent: 0, errors: 0 };
        }
    });
});
