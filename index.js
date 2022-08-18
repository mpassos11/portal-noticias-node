require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const Posts = require('./Posts.js');

mongoose.connect(`mongodb+srv://root:${process.env.PASSWORD_MONGODB}@cluster0.gvzza.mongodb.net/dankicode?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true }).then(function() {
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
        Posts.find({}).sort({ '_id': -1 }).exec(function (err, posts) {
            posts = posts.map(function(val) {
                val.descricaoCurta = val.conteudo.substr(0, 100);
                return val;
            });
            
            Posts.find({}).limit(3).sort({ 'views': -1 }).exec(function(err, topPosts) {
                topPosts = topPosts.map(function(val) {
                    val.descricaoCurta = val.conteudo.substr(0, 100);
                    return val;
                });

                res.render('home', { posts: posts, topPosts: topPosts });
            });
        });
    } else {
        Posts.find({ titulo: { $regex: req.query.busca, $options: 'i' } }, function (err, posts) {
            posts = posts.map(function(val) {
                val.descricaoCurta = val.conteudo.substr(0, 100);
                return val;
            });
            res.render('busca', { posts: posts, contagem: posts.length });
        });
    }
});

app.get('/:slug', function(req, res) {
    Posts.findOneAndUpdate({ slug: req.params.slug }, {$inc : {'views': 1}}, function(err, post) {
        if (post != null) {
            Posts.find({}).limit(3).sort({ 'views': -1 }).exec(function (err, topPosts) {
                topPosts = topPosts.map(function(val) {
                    val.descricaoCurta = val.conteudo.substr(0, 100);
                    return val;
                });
                res.render('single', { post: post, topPosts: topPosts });
            });
        } else {
            res.redirect('/');
        }
    });
});

app.listen(5000, function() {
    console.log('Server running at http://localhost:5000');
});