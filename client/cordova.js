if(Meteor.isCordova){
    Meteor.startup(function(){
        document.addEventListener("backbutton", function() {
            /*if (document.location.pathname == "/" || document.location.pathname == "/home"){
                navigator.app.exitApp();
            } else if( document.activeElement.className === "button-collapse" && document.activeElement.tagName.toUpperCase() === "A" ) {//close navbar on mobile
                document.activeElement.click();
            } else {
                history.go(-1);
            };*/
            if (depth > 0)
                history.back();
            else
                navigator.app.exitApp();
        });
    });
}
