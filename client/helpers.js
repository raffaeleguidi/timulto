Template.registerHelper("isadmin", function() { 
    return Session.get("isadmin");
});

Template.registerHelper('formatDate', function(date) {
  return moment(date).format('MM/DD/YYYY hh:mm');
});

Template.registerHelper("user", function() { 
     return Meteor.user().profile.name;
});

