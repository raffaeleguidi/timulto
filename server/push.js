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
    },
    regIdsFor: function(userId) {
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
    },
    regIdsForUsernameAndService: function(username, service) {
        var cursor = Registrations.find(
            { username: username, service: service }
        );
        var res = new Array();

        if(cursor){
            cursor.forEach(function (doc) {
                res.push(doc.regId);
            });
        }
        return res;
    }
}

//tempRegIds = new Array();

Meteor.startup(function () {
    Meteor.methods({
        registerId: function(regid, deviceUUID) {
            // save it for later reuse
            console.log("registering client: %s for user: %s to device: %s", regid, Meteor.userId(), deviceUUID);

            var thisUser = userUtils.getCurrentUsernameService();

            // remove all user registrations for the current device
            Registrations.remove({ username: thisUser.username, service: thisUser.service, uuId: deviceUUID});

            // insert user registration for the current device
            Registrations.insert({
              userId: Meteor.userId(),
              username: thisUser.username,
              service: thisUser.service,
              uuId: deviceUUID,
              regId: regid
            });
        },
        sendMessage: function(userId, msg) {
            console.log("should send a message to: %s sent from: %s", user, Meteor.userId());

            // should send a message to the latest regid for every device of the user
            var regIds = Notifications.regIdsFor(userId);
            var res = Notifications.send2android(msg, regIds);
            return { sent: regIds.length, errors: res.failure };
        },
        sendMessageToAdmins: function(msg) {
            console.log("should send a message to all admins sent from: %s", user, Meteor.userId());

            // should send a message to the latest regid for every device of the user

            var getAllAdminsIds: function() {
                var allIds = new Array();
                var cursor = Administrators.find();
                var res = new Array();

                if(cursor){
                    cursor.forEach(function (doc) {
                        allIds.push(regIdsForUsernameAndService(doc.username, doc.service));
                    });
                }
                return allIds;
            }

            var regIds = getAllAdminsIds();
            var res = Notifications.send2android(msg, regIds);
            return { sent: regIds.length, errors: res.failure };
        }
    });
});
