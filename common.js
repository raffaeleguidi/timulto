Common = {
    yesterday: function() {
        return new Date( Date.now() - 24*60*60*1000 );
    },
    getParam: function (paramName) {
        paramName = paramName.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + paramName + "=([^&#]*)"), results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },
    getFineIncludingHistory: function(fineId) {
        var fine = Fines.findOne({_id: fineId});
        if(!fine || fine == null) {
            fine = FinesHistory.findOne({_id: fineId});
            fine.live = false;
        } else {
            fine.live = true;
        }
        if (fine == null) {
            console.log("fine not found in history for _id=%s", fineId);
        }
    }
}
