const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = Schema({
    titulo: String,
    imagem: String,
    categoria: String,
    conteudo: String,
    slug: String,
}, { collection: 'posts' });

const Post = mongoose.model('Posts', postSchema);

module.exports = Post;