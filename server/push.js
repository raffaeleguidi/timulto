Meteor.startup(function () {
    Meteor.methods({
        registerId: function(regid, deviceUUID) {
            // save it for later reuse
            console.log("should register client: %s for user: %s to device: %s", regid, Meteor.userId(), deviceUUID);
        },
        sendMessage: function(user) {
            console.log("should send a message to: %s sent from: %s", user, Meteor.userId());
            // should send a message to the latest regid for every device of the user
            return { sent: 0, errors: 0 };
        }
    });
});
