// app.js
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var expressSanitizer = require('express-sanitizer');
var app = express();
var appIP = process.env.IP || '127.0.0.1';
var appPORT = process.env.PORT || 3000;

// APP CONFIG
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));


mongoose.connect('mongodb://localhost/blog_project1');

// MODELS
var blogSchema = new mongoose.Schema({
  title: 'String',
  image: 'String',
  body: 'String',
  created: {type: Date, default: Date.now},
});

var Blog = mongoose.model('Blog', blogSchema);

// Blog.create({
//   title: 'First Blog Post',
//   image: 'http://hypersprite.com/blog/wp-content/uploads/HS_2531.jpg',
//   body: 'This is an awesome blog.',
// }, function(err, cb) {
//   if (err) {
//     console.error();
//   } else {
//     console.log(cb);
//   }
// });

// ROUTES

app.get('/', function(req, res) {
  res.redirect('/blog');
});

app.get('/blog', function(req, res) {
  Blog.find({}, function(err, blog) {
    if (err) {
      console.log(err);
    } else {
      res.render('index', {blog: blog});
    }
  });
});

app.get('/blog/new', function(req, res) {
  res.render('blog-new');
});

app.get('/blog/:id/edit', function(req, res) {
  Blog.findById(req.params.id, function(err, blog) {
    if (err) {
      console.log(err);
    } else {
      res.render('blog-edit', {blog: blog});
    }
  });
});

app.get('/blog/:id', function(req, res) {
  Blog.findById(req.params.id, function(err, blog) {
    if (err) {
      console.log(err);
    } else {
      res.render('blog-id', {blog: blog});
    }
  });
});

app.post('/blog', function(req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, function(err, newBlog) {
    if (err) {
      console.log(err);
      res.redirect('/');
    } else {
      console.log('saved');
      res.redirect('/blog');
    }
  });
});

app.put('/blog/:id', function(req, res) {
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, editBlog) {
    if (err) {
      console.log(err);
      res.redirect('/');
    } else {
      console.log(`PUT ${editBlog.title}`);
      res.redirect('/blog/' + req.params.id);
    }
  });
});

app.delete('/blog/:id', function(req, res) {
  console.log('del1: ' + req.params.id);
  Blog.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      console.log(err);
      res.redirect('/blog');
    } else {
      console.log(`DELETE`);
      res.redirect('/blog');
    }
  });
});

app.listen(appPORT, appIP, function() {
  //console.log(`Blog running on ${appIP}:${appPORT} ${Date()}`);
  console.log('Blog running on ' + appIP + ':' + appPORT);
});
