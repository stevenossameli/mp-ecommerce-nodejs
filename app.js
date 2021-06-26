var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser')
var port = process.env.PORT || 3000

var app = express();

// create application/json parser

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('assets'));

app.use('/assets', express.static(__dirname + '/assets'));

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.render('home');
});


app.get('/detail', function (req, res) {
    res.render('detail', req.query);
});

//notification_url
app.post('/notification', function (req, res) {
    console.log(req.body)
    res.json({"status": "received"});
});


// Back URLs
app.get('/success', function (req, res) {
    res.render('success', req.query);
});

app.get('/pending', function (req, res) {
    res.render('pending', req.query);
});

app.get('/failure', function (req, res) {
    res.render('failure', req.query);
});


app.listen(port);