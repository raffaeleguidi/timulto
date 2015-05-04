
Router.route('/', function () {
  this.render('main');
});

Router.onBeforeAction(function() {
  GoogleMaps.load();
  this.next();
}, { only: ['finesmap'] });

Router.map(function(){
  this.route('finesmap', {path: '/mappaSegnalazioni'});
});
Router.map(function(){
  this.route('listaSegnalazioni', {path: '/listaSegnalazioni'});
});

Router.map(function(){
  this.route('chisiamo', {path: '/chisiamo'});
});

Router.map(function(){
  this.route('fineDetails', {path: '/dettaglioSegnalazione'});
});

Router.map(function(){
  this.route('main', {path: '/home'});
});

Router.map(function(){
  this.route('admin', {path: '/gestioneSegnalazioni'});
});

//Router.map(function(){
//  this.route('list', {path: '/notifications'});
//});

//
//Router.map(function(){
//  this.route('about', {path: '/about'});
//});

//Router.map(function(){
//  this.route('home', {path: '/'});
//});
