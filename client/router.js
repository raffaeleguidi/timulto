
Router.map(function () {
    this.route('segnalazioni', {
      path: '/',
      trackPageView: true
  });
});


Router.map(function () {
    this.route('crea', {
      path: '/crea',
      trackPageView: true
  });
});

Router.map(function(){
  this.route('mappa', {
      path: '/mappa',
      trackPageView: true
  });
});
Router.map(function(){
  this.route('navigatore', {
      path: '/naviga',
      trackPageView: true
  });
});

Router.map(function(){
  this.route('chisiamo', {
      path: '/chisiamo',
      trackPageView: true
  });
});

Router.map(function(){
  this.route('dettaglio', {
      path: '/dettaglio',
      trackPageView: true
  });
});

//Router.map(function(){
//  this.route('segnalazioni', {
//      path: '/segnalazioni',
//      trackPageView: true
//  });
//});
