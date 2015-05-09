function rootUrl() {
    return "http://beta.timulto.org/";
}

Template.registerHelper("rootUrl", function() {
    if (!Session.get("rootUrl")) {
        Meteor.call("rootUrl", function(err, res){
            if (err) {
                console.log("error "+err);
            }
            Session.set("rootUrl", res)
            return res;
        });
    } else {
        return Session.get("rootUrl");
    }
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



