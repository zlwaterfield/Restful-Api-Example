var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    ObjectID = mongo.ObjectID;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('test', server);

db.open(function(err, db) {
    if(!err) {
        db.collection('collection1', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'collection1' collection doesn't exist.");
            }
        });
    }
});

/*============================================
                GETS
 ============================================*/

exports.findById = function(req, res) {
    var id = req.params.id;
    db.collection('collection1', function(err, collection) {
        if(err) {
            console.log(err);
        } else {
            collection.findOne({'_id':ObjectID.createFromHexString(id)}, function(err, item) {
                res.send(item);
            });
        }
    });
};

exports.findAll = function(req, res) {
    db.collection('collection1', function(err, collection) {
        if(err) {
            console.log(err);
        } else {
            collection.find().toArray(function (err, items) {
                res.send(items);
            });
        }
    });
};

/*============================================
                DELETE
 ============================================*/

exports.remove = function(req, res) {
   var id = req.params.id;
   console.log('Deleting item: ' + id);
   db.collection('collection1', function(err, collection) {
       collection.remove({'_id': ObjectID.createFromHexString(id)}, {safe:true}, function(err, result) {
           if (err) {
               res.send({'error':'An error has occurred - ' + err});
           } else {
               console.log(result + ' document(s) deleted');
               res.send(req.body);
           }
       });
   });
};

/*============================================
            ADD
 ============================================*/

exports.add = function(req, res) {
   var add = req.query;
   console.log('Adding item: ' + JSON.stringify(add));
   db.collection('collection1', function(err, collection) {
       collection.insert(add, {safe:true}, function(err, result) {
           if (err) {
               res.send({'error':'An error has occurred'});
           } else {
               console.log('Success: ' + JSON.stringify(result[0]));
               res.send(result[0]);
           }
       });
   });
};
