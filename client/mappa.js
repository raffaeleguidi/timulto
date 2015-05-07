
var Markers = new Mongo.Collection(null);

Template.mappa.events({
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
   var coords = Geolocation.latLng();
//    console.log(JSON.stringify(coords));
    if(coords) {
        Session.set("lat",coords.lat);
        Session.set("lng",coords.lng);
    }
};

Template.mappa.rendered = function () {
    
            $(function() {
  $(window).resize(function() {
    $('.map').css('height', window.innerHeight - 82 - 45);
  });
  $(window).resize(); // trigger resize event
 });
    L.Icon.Default.imagePath = '/images';

    var lat =  Session.get("lat");
    var lon = Session.get("lng");
    //  console.log(lat);
    //  console.log(lon);

    var map = L.map('finesMap', {
        doubleClickZoom: true,
        touchZoom: true
    }).setView([lat, lon], 13);

    L.tileLayer.provider('OpenStreetMap').addTo(map);

    var theFinesCursor = Fines.find({
            approved: 1
    });

    var myIcon = L.icon({
        iconUrl: 'icon_20X20.png',
        iconSize: [20, 20]
    });

    theFinesCursor.forEach(function (fine) {
        var lat = fine.loc.coordinates[1];
        var lng = fine.loc.coordinates[0];

        if (lat && lng) {
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
            //            marker.addTo(map);
            marker.bindPopup(popupContent).openPopup();
            map.addLayer(marker);
        }
    });

 
};
