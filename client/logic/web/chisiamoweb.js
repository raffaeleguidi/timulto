
Template.chisiamoweb.rendered = function () {

    var now = moment();
//    console.log("resetting last used to " + now.toString());
    Session.set("lastUsed", now.toString());
};

Template.chisiamoweb.created = function(){
    depth = 1;
};

