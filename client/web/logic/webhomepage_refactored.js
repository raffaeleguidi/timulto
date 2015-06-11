function showChart(statistics) {

    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    var data = _.map(statistics, function(elem){
        return {
            label: TAPi18n.__(elem._id),
            value: elem.count,
            color: getRandomColor()
        };
    });

    $('.piechart').each(function(index){
        var ctx = $(this).get(0).getContext('2d');
        ctx.canvas.width = $('.chartcontainer').width()-40;
        ctx.canvas.height = ctx.canvas.width;
        var myPieChart = new Chart(ctx).Pie(data);
    })
}


Template.webhomepage_refactored.rendered = function () {

    Meteor.call("getStatistics", function(err, res){
        if (err) {
            console.log("error in getStatistics: %s ", err);
        } else {
            console.log("statistics: %s", JSON.stringify(res));
        }
        Session.set("statistics", res)
        showChart(Session.get("statistics"));
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

        showChart(Session.get("statistics"));

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

function showHome() {
    $('.tabbody').hide();
    $('.tab').css('border-bottom', '0px solid orange');
    $('.tab a').css('border-bottom', '0px solid orange');
    $('#tabhome').css('border-bottom', '2px solid orange');
    $('#home').show();
}

function showTab(tab) {
    $('div.tabbody').hide();
    var active = $($('#' + tab).attr('href'));
    active.show();

    $('.tabbody').hide();
    $('.tab').css('border-bottom', '0px solid orange');
    $('.tab a').css('border-bottom', '0px solid orange');
    $('#tabhome').css('border-bottom', '2px solid orange');
    $('#' + tab).show();

    $('#tab' + tab).addClass('active');
    $('.tab').css('border-bottom', '0px solid orange');
    $('.tab a').css('border-bottom', '0px solid orange');
    $('#tab' + tab).css('border-bottom', '2px solid orange');
}



Web = {
    showTab: showTab,
    positionLogo: function() {
        //setTimeout(function() {
            $('.map-logo').css('left', $("#mark").position().left);
        //}, 200);
    }
}

Template.webhomepage_refactored.events({
    "click .brand-logo": function(){
        showHome();
    },
    "click .map-logo": function(){
        showHome();
    }
});

function backToList() {
    $('#lista').show();
    $('#dettaglio').hide();
}

Template.webhomepage_refactored.helpers({
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
