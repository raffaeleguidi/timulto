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

      Session.set("help",help);
      Session.set("currentHelp",0);

}

Template.navbar.rendered = function(){
    initHelp();
    $('.modal-trigger').leanModal();
    $('.button-collapse').sideNav();
    $('collapsible').collapsible();
};

Template.navbar.helpers({
    helpMessage: function() {
         var help = "";
         if(Session.get("help") && Session.get("help").length> Session.get("currentHelp")){
            help = Session.get("help")[Session.get("currentHelp")];
         }
        return help;
    }
});

Template.navbar.events({
    "click #showHelp": function (event) {
        event.preventDefault();

        var currentHelp = Session.get("currentHelp");

        if (currentHelp < Session.get("help").length - 1) {
            currentHelp++;
        } else {
            currentHelp = 0;
        }

        Session.set("currentHelp", currentHelp);
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
