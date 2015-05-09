function rootUrl() {
    return "http://beta.timulto.org/";
}

Template.registerHelper("rootUrl", function() {
    return rootUrl();
});

Template.registerHelper("categories",  function() {
    //Meteor.call("getCategoriesValues");
    return Categories.find({}).fetch()
    //return Session.get("categories");
});

Template.registerHelper("isadmin", function() { 
    return Session.get("isadmin");
});

Template.registerHelper('formatDate', function(date) {
  return moment(date).format('DD/MM/YYYY HH:mm');
});

Template.registerHelper("user", function() { 
     return Meteor.user().profile.name;
});

UI.registerHelper('isCordova', function(){
  if (Meteor.isCordova){
    return true;
  }
});



