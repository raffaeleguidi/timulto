
Template.mappa.helpers({
    finesMapOptions: function() {
        var coords = Geolocation.latLng();

        if(coords) {
            var lat = coords.lat;
            var lon = coords.lng;

            // Make sure the maps API has loaded
            if (GoogleMaps.loaded()) {
                // Map initialization options
               return {
                    center: new google.maps.LatLng(lat, lon),
                    zoom: 16
                };
            }
        }
    }
});

Template.mappa.events({
    "click #clickableMapElement":function(event) {
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

            Router.go('/dettaglioSegnalazione');
        }
    }
});
Template.mappa.onCreated(function () {
    // We can use the `ready` callback to interact with the map API once the map is ready.
    GoogleMaps.ready('finesMap', function (map) {

        var theFinesCursor = Fines.find({
            approved: 1
        });

        theFinesCursor.forEach(function (fine) {
//            console.log(JSON.stringify(fine.loc));
            if (fine.loc.coordinates[0] != 0.0 && fine.loc.coordinates[1] != 0.0) {
                var myCenter = new google.maps.LatLng(fine.loc.coordinates[1], fine.loc.coordinates[0]);
                var marker = new google.maps.Marker({
                    position: myCenter,
                    icon: 'icon_20X20.png'
                });

                var content = '<div class="row" id="clickableMapElement"><input type="hidden" id="'+fine._id+'"' +
                    '<div class="col s6"><img class="mini-shot" name="imageData" src="'+fine.imageData+'" /></div>'+
      '<div id="iw_content" class="col s6">'+"Segnalato in " + fine.address+'</div>' +
   '</div>';
                var infowindow = new google.maps.InfoWindow({
//                    content: "Segnalato da " + fine.username + " in " + fine.address
                    content:content
                });

                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.open(map.instance, marker);
                    Session.set("_id", fine._id);
                });

                google.maps.event.addListener(map.instance, 'click', function() {
                    infowindow.close();
                });

                marker.setMap(map.instance);
            }

        });

        // Add a marker to the map once it's ready
//        var marker = new google.maps.Marker({
//            position: map.options.center,
//            map: map.instance
//        });

    });
});
