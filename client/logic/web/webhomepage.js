 ///////// Ultime Segnalazioni ///////////

Template.webhomepage.created = function(){
    depth = 0;
};

Template.webhomepage.rendered = function () {
    var now = moment();
//    console.log("resetting last used to " + now.toString());
    Session.set("lastUsed", now.toString());
    $(".parallax").parallax();

    $(document).ready(function(){
        $('ul.tabs').tabs();
    });

}

Template.webhomepage.helpers({

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
