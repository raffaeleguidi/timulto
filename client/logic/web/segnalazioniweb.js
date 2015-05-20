 ///////// Ultime Segnalazioni ///////////

Template.segnalazioniweb.created = function(){
    depth = 0;
};

Template.segnalazioniweb.rendered = function () {
    var now = moment();
//    console.log("resetting last used to " + now.toString());
    Session.set("lastUsed", now.toString());

    $(document).ready(function(){
        //$('.preloader-wrapper').pushpin({ top: $('.preloader-wrapper').offset().top });
    });
}

function imageUrl(){
    return Session.get("rootUrl") + "api/image/" + Session.get("dettaglio-web")._id + "?v=" +  Session.get("dettaglio-web").version;
}

Template.smallFinesInHomePage.events({
    "click .fine":function(){
        Session.set("dettaglio-web", this);
        $('#lista').hide();
        $('#dettaglio').show();
    }
});

Template.dettaglioWeb.helpers({
    imageUrl: function(){
        return imageUrl();
    },
    fineToShow: function() {
        return Session.get("dettaglio-web");
    }
});

Template.dettaglioWeb.events({
    "click #hideDettaglio": function(){
        $('#lista').show();
        $('#dettaglio').hide();
    }
});

Template.segnalazioniweb.helpers({

    finesToApprove: function() {
        return Fines.find(
            { approved: false },
            { sort: {createdAt: -1} });
    },
    latestFines: function() {
        if (Meteor.user()) {
            return Fines.find(
                {
                    $or: [
                        { approved: true },
                        { owner: Meteor.user()._id }
                    ],
                    createdAt: { $gte: Common.yesterday() }
                }, {
                    sort: { createdAt: -1 }
                });
        } else {
            return Fines.find(
                {
                    approved: true,
                    createdAt: { $gte: Common.yesterday() }
                }, {
                    sort: { createdAt: -1 }
                });
        }
    },
    hide: function(){
        return !Session.get("isadmin");
    }
});
