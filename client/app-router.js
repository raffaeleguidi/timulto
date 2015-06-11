if(Meteor.isCordova) {
    Router.map(function () {
        this.route('segnalazioni', {
          path: '/',
            onBeforeAction: function () {
                GAnalytics.pageview("/app/home");
                this.next();
            }
      });
    });
} else {
    Router.route('/', function () {
        Router.go("/web/home");
    });
}

// routes for all clients

Router.map(function () {
    this.route('crea', {
        path: '/crea',
        onBeforeAction: function () {
            GAnalytics.pageview("/crea");
            geoLocalization.getLatLng();
            this.next();
        }
    });
});

Router.map(function(){
  this.route('mappa', {
      path: '/mappa',
      onBeforeAction: function() {
        GAnalytics.pageview("/mappa");
        geoLocalization.getLatLng();
        this.next();
    }
  });
});

Router.map(function(){
  this.route('navigatore', {
      path: '/naviga',
      onBeforeAction: function () {
         GAnalytics.pageview("/naviga");
         geoLocalization.getLatLng();
         this.next();
      }
  });
});

Router.map(function(){
  this.route('chisiamo', {
      path: '/chisiamo',
      onBeforeAction: function () {
          GAnalytics.pageview("/chisiamo");
          this.next();
      }
  });
});

Router.map(function(){
  this.route('dettaglio', {
      path: '/dettaglio',
      onBeforeAction: function () {
          GAnalytics.pageview("/dettaglio");
          this.next();
      }
  });
});
