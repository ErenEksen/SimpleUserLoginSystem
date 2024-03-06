//To import the required modules
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var app = express();
var mongoose = require("mongoose"); //To communicate with database
var User = require("./models/User"); //Users in database managed by User.js
const bcrypt = require('bcrypt'); //To encrypt the password of user.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))

app.set("view engine","jade")
app.use(express.static(__dirname + '/assets'));



var port = 3333;
var mangodbServer = 'mongodb://127.0.0.1:27017';


//For connecting to database
mongoose.connect(mangodbServer);

//To render Jade pages when the user enters specific URLs
app.get("/", (req, res) =>{
    res.render('Register');
})
app.get("/login", (req, res) =>{
    res.render('Login');
})
app.get("/register", (req, res) =>{
    res.render('Register');
})

//Function that runs when the user presses the register button on the Register page
//Returns email already exists error if email is duplicate
//Otherwise creates a new user on the database with email and password variables.
app.post("/register/send", async (req, res) => {
    let email = req.body.email;
    try {
        let user = await User.findOne({ email: email });
        if (!user) {
            const hashedPass =
                await bcrypt.hash(req.body.passwd, 12); //To encrypt the password.
            user = await User.create({
                email: req.body.email,
                password: hashedPass
            });
            res.send("You have successfully registered. Now you can login");
        } else {
            res.send("E-mail already exists. Please choose a different email.");
        }
    } catch (error) {
        res.send(error);
    }
});


//First, it checks if the login email is valid.
// If valid, it compares the login password with the original password
// If it is the same, it redirects users to the empty Dashboard page.
//You can customize this.
//Otherwise, it gives error.
app.post("/login/send", async (req, res) => {

    let email = req.body.email;
    try {
        let user = await User.findOne({ email: email });
        if (!user) {
            res.send("Invalid email or password.");
        }

        else {
            try {
            let status = await bcrypt.compare(req.body.passwd, user.password);
            if (status) {
                res.render('emptyDashboard');
            } else {
                res.send("Invalid email or password.");
            }
        } catch (error) {
            res.send(error);
        }

        }
    } catch (error) {
        res.send(error);
    }
})


//To start the server.
app.listen(port);
console.log(`Server running at port ${port}`);