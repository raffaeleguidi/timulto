 ///////// Ultime Segnalazioni ///////////

Template.webhomepage.created = function(){
//    depth = 0; // not useful - this is only for cordova
//    Meteor.call("rootUrl", function(err, res){
//        if (err) {
//            console.log("error "+err);
//        }
//        Session.set("rootUrl", res)
//        console.log("rootUrl =%s", res)
//    });
//
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
            unselectAllTabsBut(item.target)
            //return false;
        });
    });

    function unselectAllTabsBut(tab) {
        console.log(tab);
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

Template.webhomepage.events({
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

Template.dettaglioWeb.events({
    "click .approve": function(){
        alert('approve');
    },
    "click .delete": function(){
        Meteor.call("deleteFine", Session.get("dettaglio-web")._id);
        backToList();
    },
    "click .likeit": function () {
        if(Meteor.user()){
            Meteor.call("likeFine", Session.get("dettaglio-web")._id, true, function(err) {
                if(err) {
                    Materialize.toast("Errore: " + err.message, 4000, 'rounded center');
                } else {
                    backToList();
                    Materialize.toast("+1 aggiunto :)", 4000, 'rounded center');
                }
            });
            GAnalytics.event("dettaglio","like");
        }
      },
    "click .idontlikeit": function () {
        if(Meteor.user()){
            Meteor.call("likeFine",Session.get("dettaglio-web")._id, false, function(err) {
                if(err) {
                    Materialize.toast("Errore: " + err.message, 4000, 'rounded center');
                } else {
                    backToList();
                    Materialize.toast("+1 rimosso :(", 4000, 'rounded center');
                }
            });
            GAnalytics.event("dettaglio","dislike");
        }
      },
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
