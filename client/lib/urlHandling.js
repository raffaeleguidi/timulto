function rootUrl() {
//    if (Session.get("rootUrl")) {
    var ret = Session.get("rootUrl");
    if (!ret) ret = "http://beta.timulto.org/";
    return ret;
//    } else {
//        Session.set("rootUrl", "http://beta.timulto.org/");
//        Meteor.call("rootUrl", function(err, res){
//            if (!err) Session.set("rootUrl", res);
//            return Session.get("rootUrl");
//        })
//        return "http://beta.timulto.org/";
//    }
}

urlHandling = {
    rootUrl: rootUrl
}
