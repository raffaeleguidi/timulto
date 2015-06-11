Template.webhomepage.rendered = function () {

    Meteor.call("getStatistics", function(err, res){
        if (err) {
            console.log("error in getStatistics: %s ", err);
        } else {
            console.log("statistics: %s", JSON.stringify(res));
        }
        Session.set("statistics", res)
        Web.showChart(Session.get("statistics"));
    });

    var now = moment();
    Session.set("lastUsed", now.toString());

    $(document).ready(function(){

        Web.positionLogo();
        Web.showTab(UI.getData().tab);
        // it overflows the menu and it is shown in homepage, in any case
        $('.leaflet-control-attribution').hide();

        $( window ).resize(function() {
            Web.positionLogo();
        });

        Web.showChart(Session.get("statistics"));

        $('.button-collapse').sideNav({
            closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
        });

        $('.button-collapse').click(function(){
            $('.leaflet-control-attribution').hide();
        });

//        $('ul.tabs').tabs();

        /* this is the REAL mess

        $('.mytab').click(function(item){
            $('div.tabbody').hide();
            $($(item.target).attr('href')).show();
        });
        $('.tab').click(function(item){
            $('div.tabbody').hide();
            var active = $($(item.target).attr('href'));
            active.show();
            unselectAllTabsBut(item.target)
        });
        */
    });

    function unselectAllTabsBut(tab) {
        console.log("unselectAllTabsBut " + tab);
        $(tab).addClass('active');
        $('.tab').css('border-bottom', '0px solid orange');
        $('.tab a').css('border-bottom', '0px solid orange');
        $(tab).css('border-bottom', '2px solid orange');
    }

    // tab highlighted at load time
    if (window.location.hash) {
        $('div.tabbody').hide();
        var active = $(window.location.hash);
        active.show();
        $('.tab').css('border-bottom', '0px solid orange');
        $('.tab a').css('border-bottom', '0px solid orange');
        $('[href=' + window.location.hash + ']').css('border-bottom', '2px solid orange');
        //hideAllTabsBut($('window.location.hash));
        $(window.location.hash).show();
        if (Common.getParam("fineId") && window.location.hash == '#segnalazioni') {
            setTimeout(function() {
                console.log("clicking %s", Common.getParam("fineId"))
                $('#' + Common.getParam("fineId")).click();
            }, 1000);
        }
    }


}

Template.webhomepage.events({
    "click .brand-logo": function(){
        Web.showHome();
    },
    "click .map-logo": function(){
        Web.showHome();
    }
});

function backToList() {
    $('#lista').show();
    $('#dettaglio').hide();
}

Template.webhomepage.helpers({
    fineIdFromQueryString: function(){
        return Common.getParam("fineId");
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



Template.navbarweb.events({
    "click .brand-logo": function(){
        showHome();
    },
    "click .map-logo": function(){
        showHome();
    },
    "click [href='#home']": function(){
        showHome();
    }
});

Template.statsBox.helpers({
    statistics: function() {
        return Session.get("statistics");
    }
});

Template.statsBoxTabular.helpers({
    statistics: function() {
        return Session.get("statistics");
    }
});

