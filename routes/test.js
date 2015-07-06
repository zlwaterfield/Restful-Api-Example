var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    ObjectID = mongo.ObjectID;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('testdb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'testdb' database");
        db.collection('test', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'test' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving test: ' + id);
    db.collection('test', function(err, collection) {
      if(err) {
        console.log(err);
      } else {
        collection.findOne({'_id':ObjectID.createFromHexString(id)}, function(err, item) {
            res.send(item);
        });
      }
    });
};

exports.findRegionsAll = function(req, res) {
    var region = req.params.region;
    var id = req.params.id;
    console.log('Retrieving test in: ' + region);
    db.collection('regions', function(err, collection) {
        if(err) {
            console.log(err);
        } else {
            collection.findOne({'name': region}, function(err, item) {
                var region_id = item.region_id;
                db.collection('test', function(err, collection) {
                    if(err) {
                        console.log(err);
                    } else {
                        collection.find({'region_id': region_id}).toArray(function(err, items) {
                            res.send(items);
                        });
                    }
                });
            });
        }
    });
};

exports.findRegions = function(req, res) {
    db.collection('regions', function (err, collection) {
        collection.find().toArray(function (err, items) {
            res.send(items);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('test', function (err, collection) {
        collection.find().toArray(function (err, items) {
            res.send(items);
        });
    });
};

exports.add = function(req, res) {
    var test = req.body;
    console.log('Adding test: ' + JSON.stringify(test));
    db.collection('test', function(err, collection) {
        collection.insert(test, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.update = function(req, res) {
    var id = req.params.id;
    var test = req.body;
    console.log('Updating test: ' + id);
    console.log(JSON.stringify(test));
    db.collection('test', function(err, collection) {
        collection.update({'_id': ObjectID.createFromHexString(id)}, test, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating test: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(test);
            }
        });
    });
};

exports.delete = function(req, res) {
    var id = req.params.id;
    console.log('Deleting test: ' + id);
    db.collection('test', function(err, collection) {
        collection.remove({'_id': ObjectID.createFromHexString(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};
