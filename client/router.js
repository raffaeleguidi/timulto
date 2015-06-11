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

    // legacy: needed?
    Router.route('/segnalazioni', function () {
        console.log("segnalazioni");
        GAnalytics.pageview("/web/segnalazioni");
        this.render('segnalazioni');
    });
    // end legacy

    Router.route('/web/home', function () {
        GAnalytics.pageview("/web/home");
        console.log("home page");
        this.render('webhomepage', {data: { tab: "home"} });
        Web.showTab("home");
        Web.positionLogo();
    });

    Router.route('/web/segnalazioni', function () {
        GAnalytics.pageview("/web/segnalazioni");
        console.log("segnalazioni web");
        this.render('webhomepage', {data: { tab: "segnalazioni"} });
        Session.set("dettaglio-web", undefined);
        Web.showTab("segnalazioni");
        Web.positionLogo();
    });

    Router.route('/web/contattaci', function () {
        GAnalytics.pageview("/web/contattaci");
        console.log("contattaci web");
        this.render('webhomepage', {data: { tab: "contattaci"} });
        Web.showTab("contattaci");
        Web.positionLogo();
    });

    Router.route('/web/segnalazione', function () {
        console.log("detail for %s", this.params.query._id);
        GAnalytics.pageview("/web/segnalazione");
        var fine = Fines.findOne({_id: this.params.query._id});
        Session.set("dettaglio-web", fine);
        this.render('webhomepage', { data: { tab: "segnalazioni", fineToShow: fine } });
        Web.positionLogo();
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
