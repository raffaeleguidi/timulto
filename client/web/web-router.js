if (!Meteor.isCordova) {    // legacy: needed?
    Router.route('/segnalazioni', function () {
        console.log("segnalazioni");
        GAnalytics.pageview("/web/segnalazioni");
        this.render('segnalazioni');
    });
    // end legacy

    Router.route('/web/home', function () {
        GAnalytics.pageview("/web/home");
        console.log("home page");
        this.render('webhomepage', {
                        data: {
                            tab: "home",
                            title: "TiMulto!",
                            summary: "Con TiMulto!, ovunque tu sia, puoi segnalare un'infrazione o mettere un \"Mi Piace\" alle segnalazioni di altri utenti per confermarne la veridicità."
                        }
                    });


        Session.set("dettaglio-web", undefined);
        Web.showTab("home");
        Web.positionLogo();
    });

    Router.route('/web/chisiamo', function () {
        GAnalytics.pageview("/web/chisiamo");
        console.log("segnalazioni web");
        this.render('webhomepage', {data: { tab: "chisiamo"} });
        Web.showTab("chisiamo");
        Web.positionLogo();
    });

    Router.route('/web/contattaci', function () {
        GAnalytics.pageview("/web/contattaci");
        console.log("contattaci web");
        this.render('webhomepage', {data: { tab: "contattaci"} });
        Web.showTab("contattaci");
        Web.positionLogo();
    });

    Router.route('/web/segnalazione', function () {
        console.log("detail for %s", this.params.query._id);
        GAnalytics.pageview("/web/segnalazione");
        var fine = Fines.findOne({_id: this.params.query._id});
        Session.set("dettaglio-web", fine);
        this.render('webhomepage', { data: { tab: "home", fineToShow: fine } });
        Web.positionLogo();
    });
}
