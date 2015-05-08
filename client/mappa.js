
var map;
var markers = {};
var myIcon;
var defaultZoomLevel = 16;
var defaultIconUrl = 'icon_20X20.png';
var defaultIconH = 20;
var defaultIconW = 20;

Template.mappa.events({
    "click #manualgeocode": function(event) {
        event.preventDefault();
        
//        Meteor.geolocalization.geocode();
        Meteor.geolocalization.latLng();
        
        map.panTo(new L.LatLng(Session.get("lat"), Session.get("lon")));
        map.setZoom(defaultZoomLevel);
    },
    "click #clickableMapElement":function(event) {
        event.preventDefault();
        
        var selectedId = Session.get("_id");
        var fine = Fines.findOne({_id:selectedId});

        if(fine) {
            console.log(JSON.stringify(fine));
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
    }
});

Template.mappa.created = function () {
    Meteor.geolocalization.latLng();
    myIcon = L.icon({
        iconUrl: defaultIconUrl,
        iconSize: [defaultIconW, defaultIconH]
    });
    
    Fines.find({approved: 1}).observe({
        added: function(fine) {/* see previous post */
            var lat = fine.loc.coordinates[1];
            var lng = fine.loc.coordinates[0];
            var popupContent =
                '<div class="row" id="clickableMapElement"><input type="hidden" id="' + fine._id + '"' +
                '<div class="col s6"><img class="mini-shot" name="imageData" src="' + fine.imageData + '" />' +
                '</div>' +
                '<div id="iw_content" class="col s6">' + "Segnalato in " + fine.address + '</div>' +
                '</div>';
            var marker = L.marker([lat, lng], {
                _id: fine._id,
                icon: myIcon,
                clickable: true
            });
            
            marker.bindPopup(popupContent).openPopup();
            markers[marker.options._id] = marker;
            
            map.addLayer(marker);
        },
        changed: function(fine) {
          var marker = markers[fine._id];
          if (marker) 
              marker.setIcon(myIcon);
        },
        removed: function(fine) {
          var marker = markers[fine._id];
          if (map.hasLayer(marker)) {
            map.removeLayer(marker);
            delete markers[fine._id];
          }
        }
    });
};

Template.mappa.rendered = function () {
    Meteor.geolocalization.latLng();
    
    
    $(function () {
        $(window).resize(function () {
            $('.map').css('height', window.innerHeight - 82 - 45);
        });
        $(window).resize(); // trigger resize event
    });
    
    L.Icon.Default.imagePath = '/images';

    var lat = Session.get("lat");
    var lon = Session.get("lon");

    if(!lat || !lon) {
        //Default termini
        lat = 41.901091;
        lon = 12.501991;
        //pisa centrale
//        lat = 43.708231;
//        lon = 10.398389
    }
    map = L.map('finesMap', {
        doubleClickZoom: true,
        touchZoom: true
    }).setView([lat, lon], defaultZoomLevel);

    L.tileLayer.provider('MapQuestOpen').addTo(map);

            
    for( index in markers ) {
        map.addLayer(markers[index]);
    }
};
