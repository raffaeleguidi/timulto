
/*Template.fineDetails.rendered = function(){
      var canvas = document.getElementById('myCanvas');
      if (!canvas) {
          console.log('myCanvas is null');
          return;
      }
      var context = canvas.getContext('2d');
      var imageObj = new Image();

      imageObj.onload = function() {
        context.drawImage(imageObj, 0, 0,350,350);//,600,600);
      };
      imageObj.src = Session.get("detailImageData");
};*/

Template.fineDetails.events({
    "click .fineonmap": function(event) {
        Session.set("selectedLat",Session.get("lat"));
        Session.set("selectedLon",Session.get("lon"));
        Session.set("zoom",18);

        Router.go("/mappa");
    },
     "click .naviga":function(event) {
         
        Session.set("selectedLat",Session.get("lat"));
        Session.set("selectedLon",Session.get("lon"));
        Session.set("selectedId", this._id);
         
        Router.go('/naviga');
    },
    "click #myCanvas": function (event) {
        if(Session.get("isadmin")/* && !Session.get("isapproved")*/){
            console.log(event);
           //drawLogo('myCanvas', event.offsetX, event.offsetY);
        }
     },
    "click .delete": function () {
        Meteor.call("deleteFine", Session.get("_id"), function(err){
            if(err)
                console.log(err);

            Router.go('/segnalazioni');
        });
      },
    "click .thumb-up": function () {
        Meteor.call("approveFine",Session.get("_id"), function(err){
            if(err)
                console.log(err);

            Router.go('/segnalazioni');
        });
      }
});

Template.fineDetails.helpers({
    createdAt: function(){
        return Session.get("createdAt");
    },
    username: function(){
        return Session.get("detailUsername");
    },
    _id:function(){
        return Session.get("_id");
    },
    isapproved:function() {
        return Session.get("isapproved");
    },
    text: function(){
        return Session.get("detailText");
    },
    address: function(){
        return Session.get("detailAddress");
    },
    category: function(){
        return Session.get("detailCategory");
    },
    imageData: function(){
        return Session.get("detailImageData");
    },
    lat: function() {
        return Session.get("lat");
    },
    lon: function() {
        return Session.get("lon");
    }
});

Template.fineInARow.events({
    "click .fine":function(){
        Session.set("lat",this.loc.coordinates[1]);
        Session.set("lon",this.loc.coordinates[0]);
        Session.set("_id", this._id);
        Session.set("createdAt", this.createdAt);
        Session.set("detailUsername", this.username);
        Session.set("detailText",this.text);
        Session.set("detailAddress",this.address);
        Session.set("detailCategory",this.category);
        //Session.set("detailImageData",$('img[name="imageData' + this._id + '"]').attr('src'));
        Session.set("isapproved", (this.approved==1?true:false));

        Router.go('/dettaglio');
    }
});

Template.fine.events({
    "click .toggle-checked": function () {
        // Set the checked property to the opposite of its current value
        Tasks.update(this._id, {
            $set: {
                checked: !this.checked
            }
        });
    },
    "click .delete": function () {
        Meteor.call("deleteFine", this._id);
    }
});

