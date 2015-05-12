
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


Template.fineDetails.rendered = function(){
    depth = 1;

    if(Session.get("isadmin")) {
        var canvas=document.getElementById("herecanvas");
        var data = Session.get("rootUrl") + "api/image/" + Session.get("_id");

        Meteor.photoHandling.fitImageInCanvas(data,canvas);
    }
}

Template.fineDetails.events({
    "click #herecanvas": function(event) {
        if(Session.get("isadmin"))
            Meteor.photoHandling.drawLogo('herecanvas', event.offsetX, event.offsetY);
    },
    "click #save": function(event) {
        if(Session.get("isadmin")) {
            var canvas = null;
            try {
                canvas = document.getElementById('herecanvas');
            } catch(ex) {
                //noop
                return false;
            }
            var imageData = canvas.toDataURL();
            var fineId = Session.get("_id");

            Meteor.call("updateImage", fineId, imageData);

            Materialize.toast("Foto aggiornata", 4000, 'rounded center');
        }
    },
    "click #findonmap": function(event) {
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
    "click .normal-shot": function() {
        if(Session.get("isadmin")/* && !Session.get("isapproved")*/){
            console.log(event);
            var canvas=document.createElement("canvas");
            var ctx=canvas.getContext("2d");
            var image=document.getElementsByClassName("normal-shot")[0];

            canvas.setAttribute("id","canvas"+Session.get("_id"));
            document.body.appendChild(canvas);

            canvas.width  = image.width;
            canvas.height = image.height;

            var context = canvas.getContext("2d");

            context.drawImage(image, 0, 0);
            console.log($("#canvas"+Session.get("_id")));
            Meteor.photoHandling.drawLogo("canvas"+Session.get("_id"), event.offsetX, event.offsetY);
        }
    },
    "click .ilikeit": function () {
        if(Meteor.user()){
//            console.log("i like it!!" + Session.get("_id"));
            Meteor.call("likeFine", Session.get("_id"), true, function(err) {
                if(err)
                    console.log("error " + err);
                else
                    Materialize.toast("Like aggiunto :)", 2000, 'rounded center');
            });
        }
      },
    "click .idontlikeit": function () {
        if(Meteor.user()){
//            console.log("i don't like it!!" + Session.get("_id"));
            Meteor.call("likeFine", Session.get("_id"), false, function(err) {
                if(err)
                    console.log("error " + err);
                 else
                    Materialize.toast("Like rimosso :(", 2000, 'rounded center');
            });
        }
      },
    "click .delete": function () {
        if(Meteor.user() && Session.get("isadmin")){
            Meteor.call("deleteFine", Session.get("_id"), function(err){
                if(err){
                    console.log(err);
                    Materialize.toast("Errore nella cancellazione", 3000, 'rounded center');
                } else {
                    Materialize.toast("Segnalazione cancellata!", 3000, 'rounded center');
                }
                Router.go('/segnalazioni');
            });
        } else {
            Materialize.toast("Utente non autorizzato.", 3000, 'rounded center');
        }
      },
    "click .thumb-up": function () {
        if(Meteor.user() && Session.get("isadmin")){
            Meteor.call("approveFine",Session.get("_id"), function(err){
                if(err) {
                    console.log(err);
                    Materialize.toast("Errore in fase di approvazione", 3000, 'rounded center');
                } else {
                    Materialize.toast("Segnalazione approvata!", 3000, 'rounded center');
                }

                Router.go('/segnalazioni');
            });
        } else {
            Materialize.toast("Utente non autorizzato.", 3000, 'rounded center');
        }
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


Template.fineInARow.helpers({
    likes: function() {
        return this.likes?this.likes.length:0;
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

