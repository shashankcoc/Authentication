require('dotenv').config()
const express= require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const app=express();

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect('mongodb://localhost:27017/newuserDB', {useNewUrlParser: true, useUnifiedTopology: true});

var userSchema = new mongoose.Schema({
    email: String,
    password: String
   
});


const User=new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.get("/logout",function(req,res){
res.redirect("/");
});

app.post("/register",function(req,res){

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        
    const newUser = new User({
        email: req.body.username,
        password: hash
        });

        newUser.save(function(err){
            if(err){
                console.log(err);
            }
            else{
                res.render("secrets");
            }
        }); 
    });

});

app.post("/login",function(req,res){

  const username=req.body.username;
    const password=req.body.password;

    User.findOne({email:username},function(err,userFound){

        if(userFound){
            bcrypt.compare(password, userFound.password, function(err, result) {
                if(result === true){
                    res.render("secrets");
                }
            });
        }
        else{
            console.log(err);
        }
    });
});

app.listen(3000,function(req,res){
    console.log("Server Started at port 3000");
});