 ///////// Ultime Segnalazioni ///////////


// to load data from restful services
// instead of meteor collections
Template.segnalazioni.rendered = function(){
    $.get("/api/segnalazioni", function(data){
        Session.set("segnalazioni", data);
    });
};

Template.segnalazioni.helpers({
    segnalazioni: function() {
        return Session.get("segnalazioni");
    },
    finesToApprove: function() {
        return Fines.find({approved:0}, {sort: {createdAt: -1}});
    },
    latestFines: function() {
        return Fines.find({approved:1}, {sort: {createdAt: -1}});
        /*return Session.get("latestFines");*/
    },
    hide:function(){
        return !Session.get("isadmin");
    }
});


Template.segnalazioni.events({
    "click #shoot": function (event) {
        Router.go('/crea');
    }
});
