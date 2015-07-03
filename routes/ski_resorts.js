var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    ObjectID = mongo.ObjectID;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('ski_resortsdb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'ski_resortsdb' database");
        db.collection('ski_resorts', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'ski_resorts' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving ski_resorts: ' + id);
    db.collection('ski_resorts', function(err, collection) {
      if(err) {
        console.log(err);
      } else {
        collection.findOne({'_id':ObjectID.createFromHexString(id)}, function(err, item) {
          console.log(item);
            res.send(item);
        });
      }
    });
};

exports.findAll = function(req, res) {
    db.collection('ski_resorts', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addSkiResort = function(req, res) {
    var ski_resort = req.body;
    console.log('Adding ski_resorts: ' + JSON.stringify(ski_resort));
    db.collection('ski_resorts', function(err, collection) {
        collection.insert(ski_resort, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateSkiResort = function(req, res) {
    var id = req.params.id;
    var ski_resort = req.body;
    console.log('Updating ski_resorts: ' + id);
    console.log(JSON.stringify(ski_resort));
    db.collection('ski_resorts', function(err, collection) {
        collection.update({'_id': ObjectID.createFromHexString(id)}, ski_resort, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating ski_resorts: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(ski_resort);
            }
        });
    });
}

exports.deleteSkiResort = function(req, res) {
    var id = req.params.id;
    console.log('Deleting ski_resorts: ' + id);
    db.collection('ski_resorts', function(err, collection) {
        collection.remove({'_id': ObjectID.createFromHexString(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}
