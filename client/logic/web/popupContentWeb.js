
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
