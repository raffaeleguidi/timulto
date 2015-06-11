Template.popupContentWeb.created = function() {
//    Meteor.call("rootUrl", function(err, res){
//        if (err) {
//            console.log("error "+err);
//        }
//        Session.set("rootUrl", res)
//        console.log("[popupContentWeb] rootUrl =%s", res)
//    });
};


Template.popupContentWeb.rendered = function() {
    var now = moment();
//    console.log("resetting last used to " + now.toString());
    Session.set("lastUsed", now.toString());
};


Template.popupContentWeb.events({
    'click #naviga': function (event) {
        event.preventDefault();
        window.open(event.target.href, '_system');
        return false;
    }
});


Template.popupContentWeb.helpers({
    'thumbUrl': function(){
        return "/api/thumb/" + this._id + "?v=" + (this.version ? this.version : '0');
    }
});
