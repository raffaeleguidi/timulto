Template.registerHelper('isiOS', function(){
  return Session.get("os") == "iOS";
});

Template.registerHelper('needBackButton', function(){
  return window.location.pathname != '/';
});


Template.registerHelper('isAndroid', function(){
  return Session.get("os") == "Android";
});

Template.registerHelper("platform",  function() {
    return Session.get("platform");
});

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
    return Categories.find({}).fetch()
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
