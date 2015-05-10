function rootUrl() {
    return Session.get("rootUrl");
}

var map;
var cluster;
var markers = {};

var myIcon;

var defaultZoomLevel = 16;
var defaultIconUrl = 'icon_30X30.png';
var defaultIconH = 30;
var defaultIconW = 30;


Template.mappa.events({
    'click a[target=_blank]': function (event) {
        event.preventDefault();
        window.open(event.target.href, '_blank');
    },
    "click #manualgeocode": function(event) {
        event.preventDefault();

        var coords = Meteor.geolocalization.latLng();
        Session.set("lat",coords.lat);
        Session.set("lon",coords.lat);
        
        map.panTo(new L.LatLng(Session.get("lat"), Session.get("lon")));
        map.setZoom(defaultZoomLevel);
    },
    "click #clickableMapElement":function(event) {
        event.preventDefault();
        var selectedId = $('input[type=\'hidden\']').attr("id");
        
//        var selectedId = Session.get("_id");
        var fine = Fines.findOne({_id:selectedId});

        if(fine) {
//            console.log(JSON.stringify(fine));
            Session.set("_id",fine._id);
            Session.set("createdAt", fine.createdAt);
            Session.set("detailUsername", fine.username);
            Session.set("detailText",fine.text);
            Session.set("detailAddress",fine.address);
            Session.set("detailCategory",fine.category);
            Session.set("detailImageData",fine.imageData);
            Session.set("isapproved", (fine.approved==1?true:false));

            Router.go('/dettaglio');
        }        
    },
    "click #shoot": function (event) {
        Router.go('/crea');
    },
    'click a[target=_blank]': function (event) {
    event.preventDefault();
    window.open(event.target.href, '_blank');
  }
});

var rendered = false;

Template.mappa.created = function () {
    if(!Session.get("lat") || !Session.get("lon")){
        Meteor.geolocalization.latLng();
    }
    
    if (!this.rendered){
    // run my code
        this.rendered = true;


        myIcon = L.icon({
            iconUrl: defaultIconUrl,
            iconSize: [defaultIconW, defaultIconH]
        });

        cluster = new L.MarkerClusterGroup();

        Fines.find({approved: 1}).observe({
            added: function(fine) {/* see previous post */
                var lat = fine.loc.coordinates[1];
                var lng = fine.loc.coordinates[0];
                var googleMapsUrl = 'http://maps.google.com/maps/?q='+lat+','+lng+'&ll='+lat+','+lng+'&z=17';
    //            var mapQuestUrl = 'http://mapq.st/map?q='+lat+','+lng+'&zoom=16&maptype=map';
                var popupContent =
                    '<div class="row center" id="clickableMapElement"><input type="hidden" id="' + fine._id + '"' +
                    '<div class="col s6"><img class="mini-shot" name="imageData" src="' + rootUrl() + 'api/thumb/' + fine._id + '" />' +
                    '</div>' +
                    '<div id="iw_content" class="col s6">' + "Segnalato in " + fine.address + '</div>' +
                    '</div><div class="row center" style="margin-top: 5px">'+'<a onclick="window.open(\'' + googleMapsUrl + '\', \'_system\');return false;" href="'+googleMapsUrl+'" target="_blank">Ottieni indicazioni</a>'+'</div>';
                var marker = L.marker([lat, lng], {
                    _id: fine._id,
                    icon: myIcon,
                    clickable: true
                });

                marker.bindPopup(popupContent).openPopup();
                markers[marker.options._id] = marker;
    //            map.addLayer(marker);
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
};

Template.mappa.rendered = function () {
//    Meteor.geolocalization.latLng();

    $(function () {
        $(window).resize(function () {
            $('.map').css('height', window.innerHeight - 82 - 45);
        });
        $(window).resize(); // trigger resize event
    });
    
    L.Icon.Default.imagePath = '/images';

    var lat = Session.get("lat");
    var lon = Session.get("lon");
    var zoom = Session.get("zoom");

    if(!zoom)
        zoom = defaultZoomLevel;


    if(!lat || !lon || lat==0 || lon==0) {
        Meteor.geolocalization.latLng();

        if(!Session.get("lat") || !Session.get("lon")) {
            //In extremis
            //Default termini
            lat = 41.901091;
            lon = 12.501991;
        }
    }
//    console.log("FOUND: lat " + lat+",lon " + lon);

    map = L.map('finesMap', {
        doubleClickZoom: true,
        touchZoom: true
    }).setView([lat, lon], zoom);

    L.tileLayer.provider('MapQuestOpen').addTo(map);

    map.addLayer(cluster);
            
//    for( index in markers ) {
//        map.addLayer(markers[index]);
//    }
};
