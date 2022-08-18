const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, '/public')));
app.set('views', path.join(__dirname, '/views'));

app.get('/', function (req, res) {
    if (req.query.busca == null) {
        res.render('home', {});
    } else {
        res.send('Você buscou por: ' + req.query.busca);
    }
});

app.get('/:slug', function(req, res) {
    res.send(req.params.slug);
});

app.listen(5000, function() {
    console.log('Server running at http://localhost:5000');
});