 ///////// Ultime Segnalazioni ///////////

Template.webhomepage.created = function(){
    depth = 0; // not useful - this is only for cordova
};

Template.webhomepage.rendered = function () {

    function positionLogo() {
        $('.map-logo').css('left', $(".row").position().left);
//        $(".map-logo").animate({
//            left: $(".row").position().left
//        }, 200, function() {
//            // noop
//        });
    }

    var now = moment();
    Session.set("lastUsed", now.toString());

    $(document).ready(function(){
        positionLogo();
        $( window ).resize(function() {
            positionLogo();
        });
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
