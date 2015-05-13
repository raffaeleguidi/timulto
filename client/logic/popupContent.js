
Template.popupContent.events({
    'click a[target=_blank]': function (event) {
        event.preventDefault();

        window.open(event.target.href, '_system');

        return false;
    }
});
