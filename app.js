// app.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const PORT = 3000;

dotenv.config();
// Replace with your MongoDB connection string
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.log(err));

// Mongoose schema and model
const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true }
});

const Post = mongoose.model('Post', postSchema);

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Route to display all posts
app.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        res.render('index', { posts });
    } catch (err) {
        console.log(err);
        res.send("An error occurred while fetching posts.");
    }
});

// Route to display a single post
app.get('/post/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.render('post', { post });
    } catch (err) {
        console.log(err);
        res.send("An error occurred while fetching the post.");
    }
});

// Route to handle new post creation
app.post('/new-post', async (req, res) => {
    const newPost = new Post({
        title: req.body.title,
        content: req.body.content
    });

    try {
        await newPost.save();
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.send("An error occurred while saving the post.");
    }
});

// Route to handle post update (edit)
app.post('/edit-post/:id', async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            content: req.body.content
        });
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.send("An error occurred while updating the post.");
    }
});

// Route to delete a post
app.post('/delete-post/:id', async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.send("An error occurred while deleting the post.");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});