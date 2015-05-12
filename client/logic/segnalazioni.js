 ///////// Ultime Segnalazioni ///////////


// to load data from restful services
// instead of meteor collections
//Template.segnalazioni.created = function(){
    /*$.get("/api/segnalazioni", function(data){
        Session.set("segnalazioni", data);
    });*/

    /*Fines.find({approved: 1}).observe({
        added: function(fine) { //see previous post
           Meteor.call("fineImage", fine._id, function (err, data) {
                if (err)
                    console.log(err);
                else {
                    console.log("Setting imageSrc" + data._id);
                    $('img[name="imageData' + data._id + '"]').attr('src', data.imageData);
                }
            });

    }});*/
//};

Template.segnalazioni.rendered = function () {
    depth = 0;
}

Template.segnalazioni.helpers({
    /*segnalazioni: function() {
        return Session.get("segnalazioni");
    },*/
    finesToApprove: function() {
        var cursor = Fines.find(
            { approved:false },
            { sort: {createdAt: -1} });

        cursor.forEach(function(doc){
            console.log("not approved " + doc._id);
        });

        return Fines.find(
            { approved: false },
            { sort: {createdAt: -1} });
    },
    latestFines: function() {
        var cursor =  Fines.find(
            {
                approved:true,
                createdAt: { $gte: Timulto.yesterday() }
            });
        cursor.forEach(function(doc){
            console.log("approved " + doc._id);
        });
        return Fines.find(
            {
                approved: true,
                createdAt: { $gte: Timulto.yesterday() }
            }, {
                sort: { createdAt: -1 }
            });
        /*return Session.get("latestFines");*/
    },
    hide:function(){
        return !Session.get("isadmin");
    }
});


Template.segnalazioni.events({
    "click #shoot": function (event) {
        Router.go('/crea');
    }
});
