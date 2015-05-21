/////////////////////////////////////
////////////// Navbar ///////////////

var help = new Array();

function initHelp() {
    help.push("Segnalare un'infrazione?");
    help.push("Attiva il GPS per abilitare la geolocalizzazione..");
    help.push("..Fai una foto alla presunta infrazione..");
    help.push("..Fai \"tap\" sulla foto per mascherare targhe e visi..");
    help.push("..Completa la scheda inserendo il tipo di segnalazione ed eventuali note..");
    help.push("..premi \"Multa\" ed è fatta!");
    help.push("Sarai automaticamente reindirizzato alla lista di segnalazioni per ognuna delle quali potrai vedere il dettaglio e mettere un \"Mi piace\" per dare credito alla segnalazione.");
    help.push("Comincia adesso, non è mai stato più facile!");

    Session.set("help",help);
    Session.set("currentHelp",0);
}
Template.navbar.created = function() {
    initHelp();
};

Template.navbar.rendered = function(){
    $('.modal-trigger').leanModal();
    $('.button-collapse').sideNav({
        //menuWidth: 300, // Default is 240
        //edge: 'right', // Choose the horizontal origin
        closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
    });
    $('collapsible').collapsible();

//    if(!localStorage.getItem("showstartuphelp")) {
//        localStorage.setItem("showstartuphelp",false);
//
//        console.log("rendering");
//        //init once
//        initHelp();
//
//        //Show help at startup
//        $('#helpbox').openModal();
//
//
//    }

};

Template.navbar.helpers({
    helpMessage: function() {
         var help = "";
         if(Session.get("help") && Session.get("help").length> Session.get("currentHelp")){
            help = Session.get("help")[Session.get("currentHelp")];
         }
        return help;
    },
    showHelpBackward: function() {

         if(Session.get("currentHelp") > 0) {
            return "enabled";
        } else {
            return "disabled";
        };
    },
    showHelpForward: function() {
         if(Session.get("currentHelp") < Session.get("help").length - 1) {
            return "enabled";
        } else {
            return "disabled";
        };
    }
});


var HELP_DIRECTION = {
    BACKWARD:0,
    FORWARD:1
};

function showHelp(helpDirection) {
    var currentHelp = Session.get("currentHelp");

    if ( Session.get("help") )
    {
        if( helpDirection == HELP_DIRECTION.BACKWARD &&
            Session.get("currentHelp") > 0 ) {
                currentHelp--;
        } else if( helpDirection == HELP_DIRECTION.FORWARD &&
                 currentHelp < Session.get("help").length - 1) {
            currentHelp++;
        }
    } else {
        currentHelp = 0;
    }

    Session.set("currentHelp", currentHelp);
}

Template.navbar.events({
    "click #showHelpForward": function (event) {
        event.preventDefault();

        showHelp(HELP_DIRECTION.FORWARD);
       /* var currentHelp = Session.get("currentHelp");

        if ( Session.get("help") && currentHelp < Session.get("help").length - 1) {
            currentHelp++;
        } else {
            currentHelp = 0;
        }

        Session.set("currentHelp", currentHelp);*/
    },
    "click #showHelpBack": function (event) {
        event.preventDefault();

        showHelp(HELP_DIRECTION.BACKWARD);
    },
    "click #closeHelp": function (event) {
        event.preventDefault();

        currentHelp=0;
        Session.set("currentHelp", currentHelp);
    },
   "click #loginNav": function() {
        event.preventDefault();
        $('.button-collapse').sideNav('hide');
    },
    "click #logout": function(event) {
        $('.button-collapse').sideNav('show');
    }
});

