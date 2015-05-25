function backToList() {
    $('#lista').show();
    $('#dettaglio').hide();
}

function imageUrl(){
    return Session.get("rootUrl") + "api/image/" + Session.get("dettaglio-web")._id + "?v=" +  Session.get("dettaglio-web").version;
}

Template.dettaglioWeb.helpers({
    imageUrl: function(){
        return imageUrl();
    },
    fineToShow: function() {
        return Session.get("dettaglio-web");
    }
});

Template.dettaglioWeb.events({
    "click #hideDettaglio": function(){
        $('#lista').show();
        $('#dettaglio').hide();
    }
});

Template.dettaglioWeb.events({
    "click .approve": function(){
        alert('approve');
    },
    "click .delete": function(){
        Meteor.call("deleteFine", Session.get("dettaglio-web")._id);
        backToList();
    },
    "click .likeit": function () {
        if(Meteor.user()){
            Meteor.call("likeFine", Session.get("dettaglio-web")._id, true, function(err) {
                if(err) {
                    Materialize.toast("Errore: " + err.message, 4000, 'rounded center');
                } else {
                    backToList();
                    Materialize.toast("+1 aggiunto :)", 4000, 'rounded center');
                }
            });
            GAnalytics.event("dettaglio","like");
        }
      },
    "click .idontlikeit": function () {
        if(Meteor.user()){
            Meteor.call("likeFine",Session.get("dettaglio-web")._id, false, function(err) {
                if(err) {
                    Materialize.toast("Errore: " + err.message, 4000, 'rounded center');
                } else {
                    backToList();
                    Materialize.toast("+1 rimosso :(", 4000, 'rounded center');
                }
            });
            GAnalytics.event("dettaglio","dislike");
        }
      },
});

