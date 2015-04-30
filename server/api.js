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
        {sort:{createdAt:1}}
    );
    var res = new Array();

    if(cursor){
        cursor.forEach(function (doc) {
            res.push(sanitize(doc));
        });
    }
    return res;
}

Restivus.addRoute('fines/:service', {authRequired: false}, {
    get: function () {
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
