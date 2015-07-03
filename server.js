var express = require('express'),
    ski_resorts = require('./routes/ski_resorts');

var app = express();

app.configure(function () {
    // app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

app.get('/ski_resorts', ski_resorts.findAll);
app.get('/ski_resorts/:id', ski_resorts.findById);
app.post('/ski_resorts', ski_resorts.addSkiResort);
app.put('/ski_resorts/:id', ski_resorts.updateSkiResort);
app.delete('/ski_resorts/:id', ski_resorts.deleteSkiResort);

app.listen(3000);
console.log('Listening on port 3000...');
