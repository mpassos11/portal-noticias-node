require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

mongoose.connect(`mongodb+srv://root:${process.env.PASSWORD_MONGODB}@cluster0.gvzza.mongodb.net/?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true }).then(function() {
    console.log('Connected to MongoDB...');
}).catch(function(err) {
    console.error(err.message);
});

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
        res.render('busca', {});
    }
});

app.get('/:slug', function(req, res) {
    //res.send(req.params.slug);
    res.render('single', {});
});

app.listen(5000, function() {
    console.log('Server running at http://localhost:5000');
});