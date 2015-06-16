Router.route('/web/seo', function () {
    var fine = Common.getFineIncludingHistory(this.params.query._id);
    var title = "Segnalazione " + fine.address + " - TiMulto!"
    var description = fine.address + " " + fine.text;
    var image = process.env.ROOT_URL + "api/image/" + fine._id;
    var redirect = process.env.ROOT_URL + "web/segnalazione?_id=" + fine._id;
    this.response.write('<html><head>');
    this.response.write('<meta property="og:title" content="' + title + '" />');
    this.response.write('<meta property="og:description" content="' + description + '" />');
    this.response.write('<meta property="og:image" content="' + image + '" />');
    this.response.write('<meta http-equiv="refresh" content="0; url=' + redirect + '">');
    this.response.write('</head><html>');
    this.response.end("Stiamo andando a " + fine.address + "...");
}, { where: 'server' });
