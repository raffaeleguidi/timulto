
Router.route('/', function () {
  this.render('main');
});

//
//Router.map(function(){
//  this.route('admin', {path: '/admin'});
//});

Router.map(function(){
  this.route('listaSegnalazioni', {path: '/listaSegnalazioni'});
});

Router.map(function(){
  this.route('main', {path: '/home'});
});

Router.map(function(){
  this.route('admin', {path: '/gestioneSegnalazioni'});
});

//
//Router.map(function(){
//  this.route('about', {path: '/about'});
//});
//
//Router.map(function(){
//  this.route('hello', {path: '/hello'});
//});
//
//Router.map(function(){
//  this.route('home', {path: '/'});
//});