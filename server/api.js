function sanitize(fine) {
    delete fine.username;
    delete fine.owner;
    delete fine.lat;
    delete fine.lng;
    return fine;
}

function findFinesFor(service) {
    var cursor = Fines.find(
        {$and:[{approved: 1}, service]},
        {sort:{createdAt: 1}}
    );
    var res = new Array();

    if(cursor){
        cursor.forEach(function (doc) {
            res.push(sanitize(doc));
        });
    }
    return res;
}

function allFines() {
    var cursor = Fines.find(
        {},
        {sort:{createdAt: -1}}
    );
    var res = new Array();

    if(cursor){
        cursor.forEach(function (doc) {
            res.push(sanitize(doc));
        });
    }
    return res;
}
var key = 'this is the key';

Restivus.addRoute('token/:message', {authRequired: false}, {
    get: function () {
      console.log(this);
      return {
        body: {
            token: CryptoJS.HmacMD5(
                this.request.headers.timestamp + '#' +
                this.request.headers.app + '#' +
                this.urlParams.message,
            key).toString()
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

      /*var check = CryptoJS.HmacMD5(
                this.request.headers.timestamp + '#' +
                this.request.headers.app + '#' +
                this.urlParams.service,
            key).toString();

      console.log(check);

      if (this.request.headers.token != check) return {
        statusCode: 401,
        body: {status: 'unauthorized', message: 'Token is not correct'}
      };*/

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

Restivus.addRoute('fine/:id/:service', {authRequired: false}, {
    post: function () {

        /*var check = CryptoJS.HmacMD5(
                    this.request.headers.timestamp + '#' +
                    this.request.headers.app + '#' +
                    this.urlParams.service + '#' +
                    this.urlParams.id,
                key).toString();

        console.log(check);

        if (this.request.headers.token != check) return {
            statusCode: 401,
            body: {status: 'unauthorized', message: 'Token is not correct'}
        };*/

        var filter = {}; filter[this.urlParams.service] = this.bodyParams.postId;
        var updatedCount = Fines.update({_id: this.urlParams.id, approved: 1}, {$set: filter});
        if (updatedCount == 1) {
          return {status: "success"};
        }
        return {
          statusCode: 400,
          body: {status: "fail", message: "Unable to find fine"}
        };
    }
});

WebApp.connectHandlers.use(function(req, res, next) {
    var re = /^\/webappapi\/image\/(.*)$/.exec(req.url);
    if (re !== null) {   // Only handle URLs that start with /url_path/*

        /* var filePath = process.env.PWD + '/.server_path/' + re[1];
        var data = fs.readFileSync(filePath, data);*/
        var fine = Fines.findOne({_id: re[1], approved: 1});
        if (fine) {
            var rawData = decodeBase64Image(fine.imageData).data
            res.writeHead(200, {
                    'Content-Type': 'image/png',
                    'Content-Length': rawData.length,
                    'transfer-encoding': ''
                    /*'Content-Type': 'text/plain'*/
            });
            res.write(rawData);
        } else {
            res.writeHead(404);
        }

        res.end();
    } else {  // Other urls will have default behaviors
        next();
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

Restivus.addRoute('imageold/:fineId', {authRequired: false}, {
    get: function () {
        var fine = Fines.findOne({_id: this.urlParams.fineId});

        if (fine) {
            var rawData = decodeBase64Image(fine.imageData).data;
            return {
              statusCode: 200,
              headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public,max-age=86400'
              },
              /* this switches off chunked transfer
              headers: {
                'Content-Type': 'image/png',
                'Content-Length': rawData.length,
                'transfer-encoding': 'identity',
                'Cache-Control': 'public,max-age=86400'
              },*/
              body: rawData
            }
        } else {
            return {
              statusCode: 404,
              body: 'cannot find timulto #' + this.urlParams.fineId
            }
        }
    }
});

var fs = Npm.require('fs');
var os = Npm.require('os');

function writeToFile(fileName, buffer) {
    //console.log("will write to %s", fileName);
    var fd = fs.openSync(fileName, 'w');
    var bytes = fs.writeSync(fd, buffer.data, 0, buffer.data.length);
    //console.log("written %d bytes", bytes);
    fs.closeSync(fd);
    //console.log("written %s", fileName);
}

function readFile(fileName) {
    return fs.readFileSync(fileName);
}


Restivus.addRoute('thumb/:fineId/:version', {authRequired: false}, {
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

Restivus.addRoute('image/:fineId/:version', {authRequired: false}, {
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

        addCategory('PRC', 'Parcheggio incivile');
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
