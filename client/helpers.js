Template.registerHelper("rootUrl", function() {
    Session.get("ROOT_URL");
    /*Meteor.call('rootUrl', function (error, result) {
      if (error) {
        return "";
      } else {
        console.log("rootUrl=" + result);
        return result;
      }
    });*/
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



