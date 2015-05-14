
Template.popupContent.rendered = function() {
    var now = moment();
//    console.log("resetting last used to " + now.toString());
    Session.set("lastUsed", now.toString());
};


Template.popupContent.events({
    'click a[target=_blank]': function (event) {
        event.preventDefault();

        window.open(event.target.href, '_system');

        return false;
    }
});
