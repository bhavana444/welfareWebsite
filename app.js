//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const ejs=require('ejs');
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tikvv.mongodb.net/todoDB?retryWrites=true&w=majority`, {
  useNewUrlParser: true,});


const postSchema = {
  title: String,
  content: String
};
const userSchema ={
  email: String,
  password: String,
  
};


const Post = mongoose.model("entries", postSchema);
const User = mongoose.model("User", userSchema);

app.get('/',function(req,res){
  res.render("initial")
});
app.get('/home',function(req,res){
  res.render("home")
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/register", function (req, res) {
  res.render("register");
});
app.post("/register", function (req, res) {
  const newUser=new User({
    email: req.body.username ,
    password:req.body.password
  });
  const username= req.body.username;
  User.findOne({email:username}, function (err,foundUser) {
    if (err) throw err;
    else {
     if(foundUser){
       res.redirect("/login")
     }
     else{
    newUser.save(function (err) {
      if (err) throw err;
      else {
          res.redirect("/login");
      }
    
  });
}
    }
     });
    
});
app.post("/login", function (req, res) {
 
   const username= req.body.username;
   const password= req.body.password;
 
  User.findOne({email:username}, function (err,foundUser) {
    if (err) throw err;
    else {
     if(foundUser){
       
       if(foundUser.password==password){
        res.redirect("/home");
       }
      else{
        res.redirect("/register");
      }
     }else{
      res.redirect("/register");
     }
  }
  });
});
app.get("/feedback", function(req, res){

  Post.find({}, function(err, posts){
    res.render("feedback", {
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(){
    
        res.redirect("/feedback");
    
  });
});

app.post("/publish",function(req,res){
  res.redirect("/compose")
})
app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});
app.get('/activities',function(req,res){
  res.render("activities")
});
app.get("/about", function(req, res){
  res.render("about");
});

app.get("/contact", function(req, res){
  res.render("contact");
});

let port=process.env.PORT;
if(port == null || port==""){
  port=3000;
}
app.listen(port, function() {
  console.log("Server has started successfully");
});
