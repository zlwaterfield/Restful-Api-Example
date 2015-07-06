var express = require('express'),
    test = require('./routes/test');

var app = express();

app.configure(function () {
     app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

app.get('/test', test.findAll);
app.get('/regions', test.findRegions);
app.get('/:region/test', test.findRegionsAll);
app.get('/test/:id', test.findById);
app.post('/test', test.add);
app.put('/test/:id', test.update);
app.delete('/test/:id', test.delete);

app.listen(3000);
console.log('Listening on port 3000...');
