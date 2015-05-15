
Router.map(function () {
    this.route('segnalazioni', {
      path: '/'
  });
});

Router.map(function () {
    this.route('crea', {
      path: '/crea'
  });
});

Router.map(function(){
  this.route('mappa', {
      path: '/mappa'
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
