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
