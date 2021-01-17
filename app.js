//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));
mongoose.connect("mongodb://localhost:27017/usersDB", {useUnifiedTopology: true, useNewUrlParser: true});
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
// Mongoose-encrypter encrypts the field when the document is saved and decrypts when the find method is called.
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});
const User = new mongoose.model("User", userSchema);
app.get("/", function(req, res){
  res.render("home");
});
app.get("/login", function(req, res){
  res.render("login");
});
app.get("/register", function(req, res){
  res.render("register");
});
app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if(!err){
      res.render("secrets");
    }
    else{
      console.log(err);
    }
  });
});
app.post("/login", function(req, res){
  User.findOne({email: req.body.username}, function(err, user){
    if(!err && user && req.body.password === user.password){
       res.render("secrets");
    }
    else if(err){
      console.log(err);
    }
  });
  // User.findOne({email: "nbabu724@gmail.com"}, function(err, result){
  //   console.log(result);
  // });
})











app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
