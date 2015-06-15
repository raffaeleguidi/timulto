Registrations = new Mongo.Collection("registrations");

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

//tempRegIds = new Array();

Meteor.startup(function () {
    Meteor.methods({
        registerId: function(regid, deviceUUID) {
            // save it for later reuse
            console.log("registering client: %s for user: %s to device: %s", regid, Meteor.userId(), deviceUUID);

            // remove all user registrations for the current device
            Registrations.remove({ userId: Meteor.userId(), uuId: deviceUUID});

            // insert user registration for the current device
            Registrations.insert({
              userId: Meteor.userId(),
              uuId: deviceUUID,
              regId: regid
            });
        },
        sendMessage: function(userId, msg) {
            console.log("should send a message to: %s sent from: %s", user, Meteor.userId());

            function regIdsFor(userId) {
                var cursor = Registrations.find(
                    { userId: userId }
                );
                var res = new Array();

                if(cursor){
                    cursor.forEach(function (doc) {
                        res.push(doc.regId);
                    });
                }
                return res;
            }

            // should send a message to the latest regid for every device of the user
            var regIds = regIdsFor(userId);
            var res = Notifications.send2android(msg, regIds);
            return { sent: regIds.length, errors: res.failure };
        }
    });
});
