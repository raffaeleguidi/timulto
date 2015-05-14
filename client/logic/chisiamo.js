/*
Template.chisiamo.rendered = function () {
    depth = 1;
}
*/

Template.chisiamo.created = function(){
    depth = 1;
});

Template.chisiamo.events({
    "click #shoot": function (event) {
        Router.go('/crea');
    }
});
