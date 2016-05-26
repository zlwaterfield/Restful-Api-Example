var express = require('express'),
    actions = require('./routes');

var app = express();

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieSession({secret: 'app_1'}));
app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
// app.use(express.bodyParser());

app.use("/favicon.ico", express.static('public/favicon.ico'));
app.use("/fonts", express.static('public/fonts'));

app.get('/', express.static('public'));
app.get('/get', actions.findAll);
app.get('/get/:id', actions.findById);
app.get('/remove/:id', actions.remove);
app.get('/add', actions.add);

app.get('*', function(req, res, next) {
    res.status(500).send('Sorry this URL is not found!');
});

app.listen(3000);
console.log('Listening on port 3000...');
