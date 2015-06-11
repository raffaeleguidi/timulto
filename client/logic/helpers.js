Template.registerHelper('gaAccount', function(){
    return Meteor.settings.public.ga.account ? Meteor.settings.public.ga.account : '';
    //return "UA-63007561-1";
});

Template.registerHelper('thumbUrl', function(){
    return Session.get("rootUrl") + "api/thumb/" + this._id + "?v=" + (this.version ? this.version : '0');
});

Template.registerHelper('isiOS', function(){
  return Session.get("os") == "iOS";
});

Template.registerHelper('needBackButton', function(){
  //return window.location.pathname != '/';
    return depth > 0;
});


Template.registerHelper('isAndroid', function(){
  return Session.get("os") == "Android";
});

Template.registerHelper("platform",  function() {
    return Session.get("platform");
});

Template.registerHelper("finesNotYetLoaded",  function() {
    return Session.get("finesLoaded") != true;
});

Template.registerHelper("rootUrl", function() {
//    if (!Session.get("rootUrl")) {
//        Meteor.call("rootUrl", function(err, res){
//            if (err) {
//                console.log("error "+err);
//            }
//            Session.set("rootUrl", res)
//            return res;
//        });
//    } else {
        return Session.get("rootUrl");
//    }
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

Template.registerHelper("isLoggedIn", function() {
    return userUtils.isLoggedIn();
});

UI.registerHelper('isCordova', function(){
  if (Meteor.isCordova){
    return true;
  }
});
