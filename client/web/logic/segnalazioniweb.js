
//Template.smallFinesInHomePage.events({
//    "click .fine":function(){
//        Session.set("dettaglio-web", this);
//        $('#lista').hide();
//        $('#dettaglio').show();
//    }
//});
//

Template.segnalazioniweb.helpers({

    fineToShow: function() {
        return Session.get("dettaglio-web");
    },
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
