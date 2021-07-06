require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const md5 = require('md5');

const app = express();

app.use(express.static('public'));

app.use(express.urlencoded({
    extended: true
}));

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const userSchema = mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model("User", userSchema);



app.get("/", function (req, res) {
    res.render('home');
});



app.route("/login")

    .get(function (req, res) {
        res.render('login');
    })

    .post(function (req, res) {
        User.findOne({
            email: req.body.username
        }, function (err, account) {
            if (err) {
                console.log(err);
            } else if (!account) {
                console.log("Username is wrong");
                res.redirect("/login");
            } else if (account.password != md5(req.body.password)) {
                console.log("Password is wrong");
                res.redirect("/login");
            } else {
                res.render("secrets");
            };
        });
    })

;



app.route("/register")

    .get(function (req, res) {
        res.render('register');
    })

    .post(function (req, res) {

        User.findOne({
            email: req.body.username
        }, function (err, account) {
            if (err) {
                console.log(err);
            } else if (account) {
                console.log("email already exists");
                res.redirect("/register");
            } else {

                const newUser = new User({
                    email: req.body.username,
                    password: md5(req.body.password)
                });

                newUser.save(function (err) {
                    if (!err) {
                        res.render("secrets");
                    };
                });
            };
        });
    })

;



app.get("/logout", function (req, res) {
    res.redirect("/");
});



app.listen(3000, function () {
    console.log('Server is running...')
});