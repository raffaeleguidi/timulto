imageHandling = {
    reload: function(selector) {
        var thumb2reload = $(selector);
        console.log(thumb2reload);
        thumb2reload.attr('src', thumb2reload.attr('src') + '?' + new Date());
    }
}
