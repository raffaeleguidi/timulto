function rootUrl() {
    if (Session.get("rootUrl")) {
        return Session.get("rootUrl");
    } else {
        Session.set("rootUrl", "http://beta.timulto.org");
        Meteor.call("rootUrl", function(err, res){
            if (!err) Session.set("rootUrl", res);
            return Session.get("rootUrl");
        })
        return "http://beta.timulto.org";
    }
}

urlHandling = {
    rootUrl: rootUrl
}
