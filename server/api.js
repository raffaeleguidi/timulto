        this.statusCode = 200;
// Generates: GET, POST on /api/users and GET, DELETE /api/users/:id for
//Restivus.addCollection(Fines, {excludedEndpoints: ['post', 'put','deleteAll', 'delete']});


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
    var re = /^\/api\/image\/(.*)$/.exec(req.url);
    if (re !== null) {   // Only handle URLs that start with /url_path/*

        console.log(re[1]);
       /* var filePath = process.env.PWD + '/.server_path/' + re[1];
        var data = fs.readFileSync(filePath, data);*/
        var fine = Fines.findOne({_id: re[1], approved: 1});
        if (fine) {
            res.writeHead(200, {
                    'Content-Type': 'image/png',
                    'transfer-encoding', ''
                    /*'Content-Type': 'text/plain'*/
            });
            res.write(decodeBase64Image(fine.imageData).data);
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

Restivus.addRoute('nooooimage/:fineId', {authRequired: false}, {
    get: function () {

        var fine = Fines.findOne({_id: this.urlParams.fineId, approved: 1});

        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'image/png'/*,
            'Cache-Control': 'max-age=86400'*/
          },
          body: decodeBase64Image(fine.imageData).data
        };

        /*

Remote Address:127.0.0.1:3000
Request URL:http://localhost:3000/images/timulto.png
Request Method:GET
Status Code:304 Not Modified
Request Headers
    Accept:image/webp,;q=0.8
    Accept-Encoding:gzip, deflate, sdch
    Accept-Language:en-US,en;q=0.8,it;q=0.6
    Cache-Control:max-age=0
    Connection:keep-alive
    Host:localhost:3000
    If-Modified-Since:Sat, 09 May 2015 14:03:33 GMT
    If-None-Match:"13516-1431180213000"
    Referer:http://localhost:3000/
    User-Agent:Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.95 Safari/537.36
Response Headers
    accept-ranges:bytes
    cache-control:public, max-age=86400
    connection:keep-alive
    date:Sat, 09 May 2015 14:05:03 GMT
    etag:"13516-1431180213000"
    last-modified:Sat, 09 May 2015 14:03:33 GMT
    vary:Accept-Encoding

Remote Address:127.0.0.1:3000
Request URL:http://localhost:3000/api/image/uzyYKjhSwSKgzNrKc
Request Method:GET
Status Code:200 OK
Request Headersview source
    Accept:image/webp,;q=0.8
    Accept-Encoding:gzip, deflate, sdch
    Accept-Language:en-US,en;q=0.8,it;q=0.6
    Cache-Control:max-age=0
    Connection:keep-alive
    Host:localhost:3000
    Referer:http://localhost:3000/
    User-Agent:Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.95 Safari/537.36
Response Headersview source
    access-control-allow-origin:*
    connection:keep-alive
    content-type:image/png
    date:Sat, 09 May 2015 14:05:04 GMT
    transfer-encoding:chunked
    vary:Accept-Encoding

        */

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
