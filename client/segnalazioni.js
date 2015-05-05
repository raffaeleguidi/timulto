 ///////// Ultime Segnalazioni ///////////

Template.segnalazioni.helpers({
    finesToApprove: function() {
        return Fines.find({approved:0}, {sort: {createdAt: -1}});
    },
    latestFines: function() {
        return Fines.find({approved:1}, {sort: {createdAt: -1}});
//        return Session.get("latestFines");
    },
    hide:function(){
        return !Session.get("isadmin");
    }
});

//////////////////////////////////////////

 //////////////////////////////////////////
 ////////// Ultime Segnalazioni ///////////

/*Template.ultimeSegnalazioni.helpers({
    fines: function () {
        return Fines.find({}, {
            sort: {
                createdAt: -1
            }
        });
    }
});*/

 //////////////////////////////////////////

 //////////////////////////////////////////
 ///////// cercaSegnalazioni //////////////

/*Template.listaSegnalazioni.helpers({
    foundfines: function () {
        return Session.get("foundfines");
    }
});*/

/*Template.listaSegnalazioni.events({
    "click #resetFines": function(event){
        event.preventDefault();

        Session.set("foundfines",[]);
    },
    "click #getFines":function(event) {
        event.preventDefault();
        var filter = $("input[type='radio'][name='group1']:checked").val();

        var coords = Geolocation.latLng();
//        console.log("coords:" + JSON.stringify(coords));
        var maxD = $("#maxD").val()?$("#maxD").val():1000;
        var minD = $("#minD").val()?$("#minD").val():0;
        var lat = coords.lat;
        var lon = coords.lng;

        if(filter == "0"){ //all
            // Fines più vicini ed ordinati per data
            Meteor.call("findNearUserFine", true, lat, lon, minD,maxD, function(error,result) {
                if(error || !result) {
                    console.log("Error in searching fines." + error);
                    Session.set("foundfines",[]);
                }else {
                    console.log("found something.. " + result);
                    Session.set("foundfines",result);
                }
            });
         } else if (filter == "1") {//nearest. do not order by date
            Meteor.call("findNearUserFine", false, lat, lon, minD, maxD, function (error, result) {
                if (error || !result) {
                    console.log("Error in searching fines." + error);
                    Session.set("foundfines", []);
                }else {
                    Session.set("foundfines", result);
                }
            });
         } else if (filter == "2") {//latest
            // Fines più recenti
            Meteor.call("findLatestFines", function(error,result) {
                if(error || !result) {
                    console.log("Error in searching fines." + error);
                    Session.set("foundfines",[]);
                } else {
                    Session.set("foundfines",result);
                }
            });
         }
    }
});*/
