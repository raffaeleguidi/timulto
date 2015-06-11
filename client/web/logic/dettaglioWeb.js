function imageUrl(){
    return Session.get("rootUrl") + "api/image/" + Session.get("dettaglio-web")._id + "?v=" +  Session.get("dettaglio-web").version;
}

function iLikeThis(fine) {
    return fine.likes.indexOf(userUtils.getCurrentUsername()) >= 0;
}

Template.dettaglioWeb.helpers({
    imageUrl: function(){
        return imageUrl();
    },
    fineToShow: function() {
        return Session.get("dettaglio-web");
    },
    iLikeThis: function() {
        return iLikeThis(Session.get("dettaglio-web"));
    },
    iDontLikeThis: function() {
        return !iLikeThis(Session.get("dettaglio-web"));
    },
});

Template.dettaglioWeb.events({
    "click .approve": function(){
        alert('approve');
    },
    "click .delete": function(){
        Meteor.call("deleteFine", Session.get("dettaglio-web")._id);
        Web.backToList();
    },
    "click .mipiace": function () {
        if(userUtils.isLoggedIn()){
            Meteor.call("likeFine", Session.get("dettaglio-web")._id, true, function(err) {
                if(err) {
                    Materialize.toast("Errore: " + err.message, 4000, 'rounded center');
                } else {
                    Web.backToList();
                    Materialize.toast("+1 aggiunto :)", 4000, 'rounded center');
                }
            });
            GAnalytics.event("dettaglio","like");
        }
    },
    "click .nonmipiace": function () {
        if(userUtils.isLoggedIn()){
            Meteor.call("likeFine",Session.get("dettaglio-web")._id, false, function(err) {
                if(err) {
                    Materialize.toast("Errore: " + err.message, 4000, 'rounded center');
                } else {
                    Web.backToList();
                    Materialize.toast("+1 rimosso :(", 4000, 'rounded center');
                }
            });
            GAnalytics.event("dettaglio","dislike");
        }
    }//,
//    "click #hideDettaglio": function(){
//        $('#lista').show();
//        $('#dettaglio').hide();
//    }
});

