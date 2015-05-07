
Router.route('/', function () {
  this.render('segnalazioni');
});

Router.route('/crea', function () {
  this.render('crea');
});

//Router.onBeforeAction(function() {
//  GoogleMaps.load();
//  this.next();
//} , { only: ['mappa','navigatore'] });

Router.map(function(){
  this.route('mappa', {path: '/mappa'});
});
Router.map(function(){
  this.route('navigatore', {path: '/naviga'});
});

Router.map(function(){
  this.route('chisiamo', {path: '/chisiamo'});
});

Router.map(function(){
  this.route('fineDetails', {path: '/dettaglio'});
});

Router.map(function(){
  this.route('segnalazioni', {path: '/segnalazioni'});
});

