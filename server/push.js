
Notifications = {
    send2android: function(msg, regids) {
        var request = {
            "data": {
                "title": msg.title,
                "message": msg.message
            },
            "registration_ids": regids
            // ["APA91bFZbxuDc_u5yB38qfXin-pwPE6oVIORbSejUh8PLsIe1gaCd_suwK3WMupa7nRqlN-3alAyBFazTnP5wnHU0XNQin8fq_4vkKeaDhBTcK-Too76uo7j2Bk1AjoSnnT2cptPiC0f"]
        };
        var options = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": Meteor.settings.notifications.gcm
            },
            data: request
        };
        HTTP.post("https://gcm-http.googleapis.com/gcm/send", options);
    }
}

tempRegIds = new Array();

Meteor.startup(function () {
    Meteor.methods({
        registerId: function(regid, deviceUUID) {
            // save it for later reuse
            console.log("should register client: %s for user: %s to device: %s", regid, Meteor.userId(), deviceUUID);
            tempRegIds.push(regid);
        },
        sendMessage: function(user, msg) {
            console.log("should send a message to: %s sent from: %s", user, Meteor.userId());
            // should send a message to the latest regid for every device of the user
            Notifications.send2android(msg, tempRegIds);
            return { sent: 0, errors: 0 };
        }
    });
});
