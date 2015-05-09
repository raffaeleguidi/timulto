function rootUrl() {
    return "http://beta.timulto.org/";
}

Template.registerHelper("rootUrl", function() {
    console.log("prima" + Session.get("rootUrl"));
    if (Session.get("rootUrl") == "") {
        console.log("seconda" + Session.get("rootUrl"));
        Meteor.call("rootUrl", function(err, res){
            if (err) {
                console.log("errore");
            }
            console.log("terza"  + Session.get("rootUrl"));
            Session.set("rootUrl", res)
            return res;
        });
    } else {
        console.log("ultima" + Session.get("rootUrl"));
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



