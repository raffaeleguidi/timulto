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


Router.map(function() {
    this.route('serverFile', {
        where: 'server',
        path: /^\/uploads_url_prefix\/(.*)$/,
        action: function() {
           var filePath = process.env.PWD + '/.uploads_dir_on_server/' + this.params[1];
           var data = fs.readFileSync(filePath);
           this.response.writeHead(200, {
                'Content-Type': 'image'
           });
           this.response.write(data);
           this.response.end();
        }
    });
});

Restivus.addRoute('image/:fineId', {authRequired: false}, {
    get: function () {

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

        var fine = Fines.findOne({_id: this.urlParams.fineId, approved: 1});

        return {
          statusCode: 304,
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'max-age=86400'
          },
          body: decodeBase64Image(fine.imageData).data
        };
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
