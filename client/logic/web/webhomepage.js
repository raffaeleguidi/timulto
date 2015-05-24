 ///////// Ultime Segnalazioni ///////////

Template.webhomepage.created = function(){
    depth = 0; // not useful - this is only for cordova
    Meteor.call("rootUrl", function(err, res){
        if (err) {
            console.log("error "+err);
        }
        Session.set("rootUrl", res)
        console.log("rootUrl =%s", res)
    });

};

function showChart(statistics) {

    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    console.log('piechart begin');
     var data = _.map(statistics, function(elem){
        return {
            label: TAPi18n.__(elem._id),
            value: elem.count,
            color: getRandomColor()
        };
    });

    console.log("piechart data: %s", JSON.stringify(data));

    $('.piechart').each(function(index){
        var ctx = $(this).get(0).getContext('2d');
        ctx.canvas.width = $('.chartcontainer').width()-40;
        ctx.canvas.height = $('.chartcontainer').width()-40;
        var myPieChart = new Chart(ctx).Pie(data);
    })

    //$('.piechart').width($('.chartcontainer').width());
    //$('.piechart').height($('.chartcontainer').width());
    console.log('piechart end');

    /*var data = [
        {
            value: 300,
            color:"#F7464A",
            highlight: "#FF5A5E",
            label: "Red"
        },
        {
            value: 50,
            color: "#46BFBD",
            highlight: "#5AD3D1",
            label: "Green"
        },
        {
            value: 100,
            color: "#FDB45C",
            highlight: "#FFC870",
            label: "Yellow"
        }
    ]*/
}

Template.webhomepage.rendered = function () {

      Meteor.call("getStatistics", function(err, res){
        if (err) {
            console.log("error in getStatistics: %s ", err);
        } else {
            console.log("statistics: %s", JSON.stringify(res));
        }
        Session.set("statistics", res)
        showChart(Session.get("statistics"));

      });



    function positionLogo() {
        $('.map-logo').css('left', $(".row").position().left);
    }

    var now = moment();
    Session.set("lastUsed", now.toString());

    $(document).ready(function(){

        showHome();

        positionLogo();
        // it overflows the menu and it is shown in homepage, in any case
        $('.leaflet-control-attribution').hide();

        $( window ).resize(function() {
            positionLogo();
        });

        showChart(Session.get("statistics"));

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

function showHome() {
    $('.tabbody').hide();
    $('.tab').css('border-bottom', '0px solid orange');
    $('.tab a').css('border-bottom', '0px solid orange');
    $('#tabhome').css('border-bottom', '2px solid orange');
    $('#home').show();
}

Template.webhomepage.events({
    "click .brand-logo": function(){
        showHome();
    },
    "click .map-logo": function(){
        showHome();
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
