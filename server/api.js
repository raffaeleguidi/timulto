
var fs = Npm.require('fs');
var os = Npm.require('os');

function sanitize(fine) {
    delete fine.username;
    delete fine.owner;
    return fine;
}

function findFinesFor(service) {
    var cursor = Fines.find(
        { $and:[{ approved: true }, service ]},
        { sort:{ createdAt: 1 }}
    );
    var res = new Array();

    if(cursor){
        cursor.forEach(function (doc) {
            res.push(sanitize(doc));
        });
    }
    return res;
}

Router.route('/web/seo', function () {
    //this.render("test");
    var fine = Fines.findOne({_id: this.params.query._id});
    if(!fine) {
        fine = FinesHistory.findOne({_id:this.params.query._id});
    }
    var title = "Segnalazione " + fine.address + " - TiMulto!"
    var description = fine.address + fine.text;
    var image = process.env.ROOT_URL + "api/image/" + fine._id;
    var redirect = process.env.ROOT_URL + "web/segnalazione/?_id=" + fine._id;
    this.response.write('<html><head>');
    this.response.write('<meta property="og:title" content="' + title + '" />');
    this.response.write('<meta property="og:description" content="' + description + '" />');
    this.response.write('<meta property="og:image" content="' + image + '" />');
    this.response.write('<meta http-equiv="refresh" content="0; url=' + redirect + '">');
    this.response.write('</head><html>');
    this.response.end("Stiamo andando a " + title + "...");
}, { where: 'server' });

Restivus.addRoute('token/:message', {authRequired: false}, {
    get: function () {
      return {
        body: {
            token: CryptoJS.HmacMD5(
                this.request.headers.timestamp + '#' +
                this.request.headers.app + '#' +
                this.urlParams.message,
            Meteor.settings[this.request.headers.app] ).toString()
        }
      };
      var filter = {}; filter[this.urlParams.service] = null;
      var fines = findFinesFor(filter);
      if (fines) {
        return fines;
      }
      return {
        statusCode: 404,
        body: {status: 'fail', message: 'Fines not found'}
      };
    }
});

Restivus.addRoute('fines/:service', {authRequired: false}, {
    get: function () {

      var check = CryptoJS.HmacMD5(
                this.request.headers.timestamp + '#' +
                this.request.headers.app + '#' +
                this.urlParams.service,
            Meteor.settings[this.request.headers.app]).toString();

      console.log("token should be : %s", check);

      if (this.request.headers.token != check || this.urlParams.service.indexOf(this.request.headers.app) != 0 ) return {
        statusCode: 401,
        body: {status: 'unauthorized', message: 'Token is not correct'}
      };

      var filter = {}; filter[this.urlParams.service] = null;
      var fines = findFinesFor(filter);
      if (fines) {
        return fines;
      }
      return {
        statusCode: 404,
        body: {status: 'fail', message: 'Fines not found'}
      };
    }
});

Restivus.addRoute('fine/:id/:service', {authRequired: false}, {
    post: function () {

        var check = CryptoJS.HmacMD5(
                    this.request.headers.timestamp + '#' +
                    this.request.headers.app + '#' +
                    this.urlParams.service + '#' +
                    this.urlParams.id,
                Meteor.settings[this.request.headers.app] ).toString();

        console.log("token should be : %s", check);

        if (this.request.headers.token != check || this.urlParams.service.indexOf(this.request.headers.app) != 0) return {
            statusCode: 401,
            body: {status: 'unauthorized', message: 'Token is not correct'}
        };

        var idToSet = {}; idToSet[this.urlParams.service] = this.bodyParams.postId;

        console.log("idToSet=%s",
                    JSON.stringify(idToSet)
                   )

        var updatedCount = Fines.update(
                                { _id: this.urlParams.id },
                                { $set: idToSet });
        console.log("updated %d doc from fine/%s/%s",
                    updatedCount,
                    this.urlParams.id,
                    this.urlParams.service
                   )

        if (updatedCount == 1) {
          return {status: "success"};
        }
        return {
          statusCode: 400,
          body: {status: "fail", message: "Unable to find fine"}
        };
    }
});

function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  var response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}

function writeToFile(fileName, buffer) {
    var fd = fs.openSync(fileName, 'w');
    var bytes = fs.writeSync(fd, buffer.data, 0, buffer.data.length);
    fs.closeSync(fd);
}

function readFile(fileName) {
    return fs.readFileSync(fileName);
}


Restivus.addRoute('thumb/:fineId', {authRequired: false}, {
    get: function () {
        var fine = Fines.findOne({_id: this.urlParams.fineId});

        if (fine) {
            var tmpfile = os.tmpdir() + '/' + fine._id + '.png';
            if (!fs.existsSync(tmpfile)) {
                writeToFile(tmpfile, decodeBase64Image(fine.imageData));
            }
            var tmpthumb = os.tmpdir() + '/' + fine._id + '-thumb.png';

            if (!fs.existsSync(tmpthumb)) {
                try {
                    Imagemagick.crop({
                      srcPath: tmpfile,
                      dstPath: tmpthumb,
                      width: 100,
                      height: 100,
                      quality: 1,
                      gravity: "Center"
                    });
                } catch(ex) {
                    console.log("error creating thumb for %s: is imagemagick installed? Falling back to normal image", fine._id);
                    tmpthumb = tmpfile;
                }
            }

            var buffer = readFile(tmpthumb);
            return {
              statusCode: 200,
              headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public,max-age=86400'
              },
              /*this switches off chunked transfer
              headers: {
                'Content-Type': 'text/plain',
                'Content-Length': buffer.length,
                'transfer-encoding': 'identity',
                'Cache-Control': 'public,max-age=86400'
              },*/
              body: buffer
            }
        } else {
            return {
              statusCode: 404,
              body: 'cannot find timulto #' + this.urlParams.fineId
            }
        }
    }
});

Restivus.addRoute('image/:fineId', {authRequired: false}, {
    get: function () {
        var fine = Fines.findOne({_id: this.urlParams.fineId});

        if (fine) {
            var tmpfile = os.tmpdir() + '/' + fine._id + '.png';
            if (!fs.existsSync(tmpfile)) {
                writeToFile(tmpfile, decodeBase64Image(fine.imageData));
            }
            var buffer = readFile(tmpfile);
            return {
              statusCode: 200,
              headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public,max-age=86400'
              },
              /*this switches off chunked transfer
              headers: {
                'Content-Type': 'text/plain',
                'Content-Length': buffer.length,
                'transfer-encoding': 'identity',
                'Cache-Control': 'public,max-age=86400'
              },*/
              body: buffer
            }
        } else {
            return {
              statusCode: 404,
              body: 'cannot find timulto #' + this.urlParams.fineId
            }
        }
    }
});

Restivus.addRoute('categories', {authRequired: false}, {
    get: function () {
        var categories = new Array();

        function addCategory(key, value) {
            categories.push({
              key: key,
              value: value
            });
        }

        addCategory('PRC', 'Sosta in divieto');
        addCategory('RFT', 'Rifiuti o cassonetti sporchi');
        addCategory('ACC', 'Accessibilità scarsa o mancante');
        addCategory('ABS', 'Abusivismo');
        //addCategory('AFF', 'Affissioni abusive');
        //addCategory('BLL', 'Bullismo');
        //addCategory('CSS', 'Cassonetti sporchi');
        addCategory('DST', 'Disturbo della quiete pubblica');
        addCategory('ILL', 'Illuminazione');
        addCategory('MNT', 'Manto stradale');
        addCategory('VND', 'Atti vandalici');
        //addCategory('MRC', 'Marciapiede sporco');
        addCategory('SGN', 'Segnaletica mancante');
        //addCategory('VLZ', 'Atti di violenza');
        addCategory('MLT', 'Maltrattamento animali');
        return categories;
    }
});



// unused
function allFines() {
    var cursor = Fines.find(
        {},
        { sort:{ createdAt: -1 }}
    );
    var res = new Array();

    if(cursor){
        cursor.forEach(function (doc) {
            res.push(sanitize(doc));
        });
    }
    return res;
}

// unusued - maybe for future ajax APIs
Restivus.addRoute('segnalazioni', {authRequired: false}, {
    get: function () {
      var fines = allFines();
      if (fines) {
        return fines;
      }
      return {
        statusCode: 404,
        body: {status: 'fail', message: 'Fines not found'}
      };
    }
});

