function hideFixedActionButton() {
    $('.fixed-action-btn').mouseout();
}

Template.dettaglio.created = function () {
    depth = 1;
}

Template.dettaglio.rendered = function(){
    if(Session.get("isadmin")) {
        var canvas=document.getElementById("herecanvas");
        //var data = urlHandling.rootUrl() + "api/image/" + Session.get("_id") + "/" + (Session.get("version") ? Session.get("version") : "0" );
        var data = imageUrl();

        photoHandling.fitImageInCanvas(data, canvas, true);
    }

    var now = moment();
//    console.log("resetting last used to " + now.toString());
    Session.set("lastUsed", now.toString());
}

Template.dettaglio.events({
    "click #herecanvas": function(event) {
        if(Session.get("isadmin"))
            photoHandling.drawLogo('herecanvas', event.offsetX, event.offsetY);
    },
    "click #save": function(event) {
        hideFixedActionButton();
        if(Session.get("isadmin")) {
            try {
                var canvas = document.getElementById('herecanvas');
                var imageData = canvas.toDataURL();
                var fineId = Session.get("_id");

                Meteor.call("updateImage", fineId, imageData, function(err) {
                    if(err) {
                        Materialize.toast("Errore di salvataggio: " + err.message, 4000, 'rounded center');
                    } else {
                        Router.go("/");
                        Materialize.toast("Salvataggio completato", 4000, 'rounded center');
                    }
                });
            } catch(ex) {
                //Materialize.toast("Errore di salvataggio: " + ex.message, 4000, 'rounded center');
                alert("errore: " + ex.message);
            }
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
            photoHandling.drawLogo("canvas"+Session.get("_id"), event.offsetX, event.offsetY);
        }
    },
    "click .ilikeit": function () {
        hideFixedActionButton();
        if(Meteor.user()){
            Meteor.call("likeFine", Session.get("_id"), true, function(err) {
                if(err) {
                    Materialize.toast("Errore: " + err.message, 4000, 'rounded center');
                } else {
                    Router.go("/");
                    Materialize.toast("+1 aggiunto :)", 4000, 'rounded center');
                }
            });
        }
      },
    "click .idontlikeit": function () {
        hideFixedActionButton();
        if(Meteor.user()){
            Meteor.call("likeFine", Session.get("_id"), false, function(err) {
                if(err) {
                    Materialize.toast("Errore: " + err.message, 4000, 'rounded center');
                } else {
                    Router.go("/");
                    Materialize.toast("+1 rimosso :(", 4000, 'rounded center');
                }
            });
        }
      },
    "click .delete": function () {
        hideFixedActionButton();
        if(Meteor.user() && Session.get("isadmin")){
            Meteor.call("deleteFine", Session.get("_id"), function(err){
                if(err){
                    Materialize.toast("Errore nella cancellazione: " + err.message, 3000, 'rounded center');
                } else {
                    Router.go('/segnalazioni');
                    Materialize.toast("Segnalazione cancellata!", 3000, 'rounded center');
                }
            });
        } else {
            hideFixedActionButton();
            Materialize.toast("Utente non autorizzato.", 3000, 'rounded center');
        }
      },
    "click .thumb-up": function () {
        hideFixedActionButton();
        if(Meteor.user() && Session.get("isadmin")){
            Meteor.call("approveFine",Session.get("_id"), function(err){
                if(err) {
                    Materialize.toast("Errore in fase di approvazione: " + err.message, 3000, 'rounded center');
                } else {
                    Router.go('/segnalazioni');
                    Materialize.toast("Segnalazione approvata!", 3000, 'rounded center');
                }
            });
        } else {
            Materialize.toast("Utente non autorizzato.", 3000, 'rounded center');
        }
      }
});

function imageUrl(){
    return Session.get("rootUrl") + "api/image/" + Session.get("_id") + "?v=" + Session.get("version");
}

Template.dettaglio.helpers({
    imageUrl: function(){
        return imageUrl();
    },
    thumbUrl: function(){
        return Session.get("rootUrl") + "api/thumb/" + Session.get("_id") + "?v=" + (Session.get("version") ? Session.get("version") : '0');
    }, createdAt: function(){
        return Session.get("createdAt");
    },
    username: function(){
        return Session.get("detailUsername");
    },
    _id:function(){
        return Session.get("_id");
    },
    isapproved:function() {
        return Session.get("approved");
    },
    notApproved:function() {
        return !Session.get("approved");
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
    },
    iLikeThis: function() {
        return iLikeThis();
    },
    iDontLikeThis: function() {
        return !iLikeThis();
    },
    likesCount: function() {
        return Session.get("likes") ? Session.get("likes").length : 0;
    }
});

function iLikeThis() {
    var arr = Session.get("likes");
    for (i in arr) {
        if (arr[i] == userUtils.getCurrentUsername()) {
            return true;
        }
    }
    return false;
}

