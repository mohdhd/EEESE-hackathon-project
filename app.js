// main app entry //example

//including dependicies 
const express = require('express');
const mongoose = require('./config/mongoose');
const passport = require('./config/passport');
const session = require('express-session')
const MongoDBSession = require("connect-mongodb-session")(session)
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const expressValidator = require("express-validator");
const _ = require('lodash')


//requiring the user and message models
const User = require('./models/user');
const adminMessage = require('./models/adminMessage');

const app = express();


//set the view engine

app.set('view engine', 'ejs');



//including the authentication functions 
const { auth, authAdmin, authStudent } = require('./config/auth');


const store = new MongoDBSession({
    uri: 'mongodb://localhost:27017/project',
    database: 'project',
    collection: 'Sessions'
})
app.use(session({
    secret: '__AvGenRate__',
    resave: true,
    secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
    store: store,
    saveUninitialized: true

}));

// Setting static folder
app.use(express.static(__dirname + '/public'));

// Express Validator Middleware
app.use(
  expressValidator({
    errorFormatter: (param, msg, value) => {
      let namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += `[${namespace.shift()}]`;
      }
      return {
        param: formParam,
        msg: msg,
        value: value,
      };
    },
  })
);

//setting up the session
app.use(session({ secret: "secretsessiondecryptmessage", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

//required package for parsing the post request
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json())
//passport configuration
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});


// general user functions handling 

app.get('/signup', function(req, res) {

    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.sendFile(__dirname + '/public/signup.html');
    }



});

app.post('/signup', function(req, res) {

    if (req.isAuthenticated()) {
        return res.redirect('/');
    } else {
        const body = _.pick(req.body, ['name', 'email', 'faculty', 'username', 'year', 'role']);
        const password = req.body.password;

        bcrypt.hash(password, 10, function(err, hash) {

            if (err) {

                res.send("err happend " + err);
            } else {

                User.create({
                    name: body.name,
                    username: body.username,
                    password: hash,
                    role: body.role,
                    email: body.email,
                    faculty: body.faculty,
                    year: body.year

                }).then((user) => {
                    res.redirect('/login');
                }).catch((e) => {
                    res.send(e);
                });
            }

        });
    }

});


app.get('/', function(req, res) {


    if(req.isAuthenticated()){
        return res.render('index.ejs',{name:req.user.name,role:req.user.role});
    }else{
        res.render('index.ejs',{name:false,role:'any'});
    }

});

app.get('/login', function(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        next();
    }
}, function(req, res) {
    res.render('login');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));


app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

//profile handler

app.get('/profile',auth,(req,res)=>{
    res.render('profile.ejs',{name:req.user.name,role:req.user.role,user:_.pick(req.user,['name','role','password','faculty','email','username'])})
});


app.post('/profile',auth,(req,res)=>{

    body = req.body

    if(req.user.password !== body.password){

        bcrypt.hash(body.password, 10, function (err, hash) {

            if (err) {

                res.send("err happend " + err);
            } else {

                User.update({ email: req.body.email }, {
                    $set: {
                        name: body.name,
                        username: body.username,
                        password:hash ,
                        faculty: body.faculty,
                        email: body.email
                    }

                }, function (err, user) {
                    if (err)
                        res.send(err);
                    else
                        res.redirect('/profile');

                });

            }

        });
        
    }else{

        User.update({ email: req.body.email }, {
            $set: {
                name: body.name,
                username: body.username,
                password: body.password,
                faculty: body.faculty,
                email: body.email
            }

        }, function (err, user) {
            if (err)
                res.send(err);
            else
                res.redirect('/profile');

        });

    }

   

    



});



//user distrubter
app.get('/home', routeAuth);


//student handling 


app.get('/student', authStudent, function(req, res) {

    adminMessage.find({ target: "student" }, (err, msgs) => {
        if (err)
            res.send(err)
        else
            res.render('student/index', { name: req.user.name, msgs: msgs });
    });
});



app.get('/student/reqop',authStudent,function(req,res){

    res.render('student/req-op')

});


app.post('/student/reqop',authStudent,function(req,res){


    msg = new adminMessage({
        author : req.user.name,
        authorEmail:req.user.email,
        title:req.body.title,
        body: req.body.body, 
        target:req.body.target
    })
    msg.save((e) => {
        if (!e) {
            res.redirect('/');
        } else {
            res.send(e);
        }
    });
    
})




//admin handler 

app.get('/admin', authAdmin, function(req, res) {

    adminMessage.find({ target: "admin" },(err,msgs)=>{
        if(err)
        res.send(err)
        else
            res.render('admin/index', { name: req.user.name, msgs: msgs });
    });

   
});

app.get('/admin/panel',authAdmin,function(req,res){
    res.render('admin/panel',{name:req.user.name});
});


app.get('/admin/send',authAdmin,function(req,res){
    res.render('admin/send');
})

app.post('/admin/send', authAdmin, function (req, res) {
    msg = new adminMessage(req.body)
    msg.save((e)=>{
        if(!e){
            res.send("saved")
        }else{
            res.send(e);
        }
    });
});


app.get('/admin/addadmin',authAdmin,function(req,res){

    res.render('admin/addadmin',{name:req.user.name,role:req.user.role});

});


app.post('/admin/addadmin',authAdmin,function(req,res){
    let user = new User({
        name:req.body.name,
        password:req.body.password,
        email:req.body.email,
        username:req.body.username,
        role:'admin'
    }).save()

    res.redirect('/');
})

//staff handler

app.get('/staff',authStaff,function(req,res){
    adminMessage.find({ target: "staff" }, (err, msgs) => {
        if (err)
            res.send(err)
        else
            res.render('staff/index', { name: req.user.name, msgs: msgs });
    });
})

// Import the Posts routes
const posts = require("./routes/posts");
app.use("/posts", posts);

// Import the Comments routes
const comments = require("./routes/comments");
app.use("/comments", comments);


//run the app on port 3000
const server = app.listen(3000);
const chat = require('./chat').chat(server)
