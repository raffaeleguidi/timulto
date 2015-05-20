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

    Meteor.call("rootUrl", function(err, res){
        if (err) {
            console.log("error "+err);
        }
        Session.set("rootUrl", res)
    });

    $(document).ready(function(){

        $('#tabhome').addClass('active');
        $('#tabhome').css('border-bottom', '2px solid orange');

        positionLogo();
        // it overflows the menu and it is shown in homepage, in any case
        $('.leaflet-control-attribution').hide();

        $( window ).resize(function() {
            positionLogo();
        });
        $('.button-collapse').sideNav({
            //menuWidth: 300, // Default is 240
            //edge: 'right', // Choose the horizontal origin
            closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
        });

        $('.button-collapse').click(function(){
            $('.leaflet-control-attribution').hide();
        });

//        $('ul.tabs').tabs();

        $('.mytab').click(function(item){
            $('div.tabbody').hide();
            $($(item.target).attr('href')).show();
        });
        $('.tab').click(function(item){
            $('div.tabbody').hide();
            var active = $($(item.target).attr('href'));
            active.show();
            $(item.target).addClass('active');
            $('.tab').css('border-bottom', '0px solid orange');
            $('.tab a').css('border-bottom', '0px solid orange');
            $(item.target).css('border-bottom', '2px solid orange');
            return false;
        });

//        $('.tab').click(function(item){
//            window.location.hash = $(item.target).attr('href');
//        });

    });

    if (window.location.hash) {
        $('div.tabbody').hide();
        $(window.location.hash).show();
    }


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
