
var map;
var cluster;
var markers = {};

var myIcon;

var defaultZoomLevel = 11;
var defaultIconUrl = 'icon_30X30.png';
var defaultIconH = 30;
var defaultIconW = 30;

Template.simplemap.created = function() {
    Meteor.call("rootUrl", function(err, res){
        if (err) {
            console.log("error "+err);
        }
        Session.set("rootUrl", res)
        console.log("[simplemap] rootUrl =%s", res)
    });
};

Template.simplemap.helpers({
    mapHeight: function() {
        var mapHeight = 300;

        var mapMode = Session.get("mapexpanded");

        if(mapMode != null && mapMode) {
            mapHeight = 500;
        }

        return mapHeight;
    }
});

Template.simplemap.events({
    'click .btn-minmax': function() {
        var mapMode = Session.get("mapexpanded");

        if(mapMode != null) {
            mapMode = !mapMode;
        } else {
            mapMode = true;
        }

        Session.set("mapexpanded", mapMode);
    },
    'click a[target=_blank]': function (event) {
        event.preventDefault();
        window.open(event.target.href, '_blank');
    },

    "click #clickableMapElement":function(event) {
        event.preventDefault();

        var selectedId = $('input[type=\'hidden\']').attr("id");
        var fine = Fines.findOne({_id:selectedId});

        if(fine) {
            Session.set("dettaglio-web", fine);
            window.location.hash = '#segnalazioni';
            $('div.tabbody').hide();
            $('#lista').hide();
            $('#dettaglio').show();
            $('#segnalazioni').show();
            $('.tab').css('border-bottom', '0px solid orange');
            $('.tab a').css('border-bottom', '0px solid orange');
            $('#tabsegnalazioni').addClass('active');
            $('#tabsegnalazioni').css('border-bottom', '2px solid orange');
        }
    }
});

var rendered = false;

function init() {
    if (!rendered){
        // run my code only once
        rendered = true;

        myIcon = L.icon({
            iconUrl: defaultIconUrl,
            iconSize: [defaultIconW, defaultIconH]
        });
    }
    cluster = new L.MarkerClusterGroup();

    Meteor.call("rootUrl", function(err, res){
        if (err) {
            console.log("error "+err);
        }
        Session.set("rootUrl", res)
        console.log("[simplemap init] rootUrl =%s", res)
    });

    Fines.find({ approved:true }).observe({
        added: function(fine) {
            var lat = fine.loc.coordinates[1];
            var lng = fine.loc.coordinates[0];
            var googleMapsUrl = 'http://maps.google.com/maps/?q='+lat+','+lng+'&ll='+lat+','+lng+'&z=17';
            //var mapQuestUrl = 'http://mapq.st/map?q='+lat+','+lng+'&zoom=16&maptype=map';
            var popupContentWeb = Blaze.toHTMLWithData(
                                        Template.popupContentWeb,
                                        {
                                            fine: fine,
                                            googleMapsUrl:googleMapsUrl,
                                            rootUrl: Session.get("rootUrl")
                                        });

            var marker = L.marker([lat, lng], {
                _id: fine._id,
                icon: myIcon,
                clickable: true
            });

            marker.bindPopup(popupContentWeb).openPopup();
            markers[marker.options._id] = marker;
            //map.addLayer(marker);
            cluster.addLayer(marker);
        },
//        changed: function(fine) {
//          var marker = markers[fine._id];
//          if (marker) {
//              marker.setIcon(myIcon);
//          }
//        },
        removed: function(fine) {
            var marker = markers[fine._id];

            if (cluster.hasLayer(marker)) {
                cluster.removeLayer(marker);
                delete markers[fine._id];
            }
        }
    });
}

Template.simplemap.created = function () {
    depth = 1;
}

Template.simplemap.rendered = function () {

    init();

    $(function () {
        $(window).resize(function () {
            $('.map').css('height', window.innerHeight - 82 - 45);
        });
        $(window).resize(); // trigger resize event
    });

    L.Icon.Default.imagePath = '/images';

    var lat;
    var lng;
    var zoom = Session.get("zoom");

    if(Session.get("selectedLat") && Session.get("selectedLng")) {
        lat = Session.get("selectedLat");
        lng = Session.get("selectedLng");

        Session.set("selectedLat","");
        Session.set("selectedLng","");
        Session.set("zoom","");
    } else {
        lat = Session.get("lat");
        lng = Session.get("lng");
    }

    if(!zoom)
        zoom = defaultZoomLevel;


    if(!lat || !lng || lat==0 || lng==0) {
        geoLocalization.getLatLng();

        if(!Session.get("lat") || !Session.get("lng")) {
            //In extremis
            //Default termini
            lat = 41.901091;
            lng = 12.501991;
        }
    }

    map = L.map('finesMap', {
        doubleClickZoom: true,
        touchZoom: true
    }).setView([lat, lng], zoom);

    L.tileLayer.provider('MapQuestOpen').addTo(map);


    map.addLayer(cluster);

//    map.dragging.disable();
//    map.scrollWheelZoom.disable();
};
