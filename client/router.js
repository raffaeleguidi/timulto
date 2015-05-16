
Router.map(function () {
    this.route('webhomepage', {
      path: '/homepage'
  });
});

Router.map(function () {
    this.route('segnalazioni', {
      path: '/'
  });
});

Router.map(function () {
    this.route('crea', {
        path: '/crea',
        onBeforeAction: function () {
            geoLocalization.getLatLng();
            this.next();
        }
    });
});


Router.map(function(){
  this.route('mappa', {
      path: '/mappa',
      onBeforeAction: function() {
        geoLocalization.getLatLng();
        this.next();
    }
  });
});

Router.map(function(){
  this.route('navigatore', {
      path: '/naviga'
  });
});

Router.map(function(){
  this.route('chisiamo', {
      path: '/chisiamo'
  });
});

Router.map(function(){
  this.route('dettaglio', {
      path: '/dettaglio'
  });
});
