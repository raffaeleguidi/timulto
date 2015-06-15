Meteor.startup(function () {
    Meteor.methods({
        registerId: function(regid) {
            // save it for later reuse
            console.log("should register client: %s", regid)
        },
        sendMessage: function(user) {
            // save it for later reuse
            console.log("should send a message to: %s", user)
        }
    });
});
