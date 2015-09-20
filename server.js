var express = require('express');
var mongoose = require('mongoose');

var connectionStrings = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/conf'
mongoose.connect(connectionStrings);

var bodyParser = require('body-parser');
var multer = require('multer');
var app = express();

// passport
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var session = require('express-session');

var cookieSession = require('cookie-session');
var fs = require('fs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//app.use(multer()); // for parsing multipart/form-data
app.use(cookieParser());
app.use(session({
    secret: 'this is the secret'
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(multer({
    dest: './public/uploads/',
    rename: function (fieldname, filename) {
        console.log("Hello");
        return filename + Date.now();
    },
    onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...')
    },
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path)
        done = true;
    }
}));

var multer1 = multer({ dest: './public/uploads/' });

/*Handling routes.*/

app.post('/api/photo', function (req, res) {
    if (done == true) {
        console.log(req.files);
        res.json(req.files);
        res.end("File uploaded.");
    }
});

// Conference Schema 
var ConferenceSchema = new mongoose.Schema({
    name: String,
    state: String,
    about: String,
    city: String,
    country :String,
    sponsor: [{ name: String, url: String }],
    c_attendee: [{
        attendeeName: String, _id: String
    }],
    confdate: { type: Date, default: Date.now },
    talks: [{
        tname: String,
        time: String,
        desc: String,
        review: [{ _id: String, name: String, comment: String }],
        a_name: [{ ta_name: String, _id: String }],
        slides: [{ name: String, url: String }],
        P_name: [{ tp: String, _id: String }]
    }],
    c_review: [{ _id: String, name: String, comment: String }]
});

var Conf = mongoose.model('Confdoc', ConferenceSchema);

//User
var UserSchema = new mongoose.Schema({
    name: String,
    firstname: String,
    lastname: String,
    about: String,
    photo: String,
    password: String,
    state: String,
    interest: String,
    city: String,
    country: String,
    email: String,
    fb: String,
    github: String,
    c_attended: [{ aName: String, _id: String }],
    c_Presented: [{ pName: String, _id: String }],
    talk_presented: [{ talkname: String, _id: String, desc: String }],
    papers: [{ name: String, url: String }],
    date: { type: Date, default: Date.now },
    following: [{ name: String, _id: String }]
});
var User = mongoose.model('User', UserSchema);

var PaymentSchema = new mongoose.Schema({
    cardno: String,
    cvv: String,
    userid: String,
    talkid: String,
    amount: { type: String, default: "15usd" }
});
var Payment = mongoose.model('Payment', PaymentSchema);
var imgPath = 'C:\Users/MansoorAhmed/mk/public/images/DS.png';
 
passport.use(new LocalStrategy({
    usernameField: 'name',
    passwordField: 'password'
},
    function (name, password, done) {
        User.findOne({ name: name, password: password }, function (err, user) {
            console.log("user" + user);
            console.log("err" + err);
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            return done(null, user);
        })
    }));
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

app.post("/login", passport.authenticate('local'), function (req, res) {
    console.log("csccccsscs" + req.user)
    console.log("fgvbin"+req.err)
    var user = req.user;
    res.json(user);
});
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

app.get('/login', function (req, res) {
    User.find(function (err, docs) {
        res.json(docs);
    })
});

app.get('/loggedin', function (req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
});

app.post('/logout', function (req, res) {
    req.logOut();
    res.send(200);
});
var auth = function (req, res, next) {
    if (!req.isAuthenticated())
        res.send(401);
    else
        next();
};

// CONFERENCE METHODS
// admin
app.delete('/rest/conference/:id', function (req, res) {
    Conf.remove({ _id: req.params.id }, function (err, count) {
        Conf.find(function (err, docs) {
            res.json(docs);
        })
    })
});
// admin
app.get('/rest/conference', function (req, res) {
    Conf.find(function (err, docs) {
        res.json(docs);
    })
});
// admin get conference id
app.get('/rest/admin/conference/:id', function (req, res) {
    Conf.find({ _id: req.params.id }, function (err, docs) {
        res.json(docs);
    })
});

// admin get talk id 
app.get('/rest/admin/talk/:id', function (req, res) {
    Conf.find({ _id: req.params.id }, function (err, docs) {
        res.json(docs);
    })
});
// update user
app.put('/rest/user/update/:id', function (req, res) {
    delete req.body._id;
    console.log(req.params.id);
    console.log("I am here in user update" + req.body)
    User.update({ _id: req.params.id }, req.body, function (err, count) {
        console.log(err);
        User.find(function (err, docs) {
            res.json(docs);
        });
    });

});

// update page
app.put('/rest/conference/update/:id', function (req, res) {
    delete req.body._id;
    Conf.update({ _id: req.params.id }, req.body, function (err, count) {
        Conf.find(function (err, docs) {
            res.json(docs);
        });
    });
});

//
app.put('/rest/talk/update/:id', function (req, res) {
    delete req.body._id;
    Conf.update({ _id: req.params.id }, req.body, function (err, count) {
        Conf.find(function (err, docs) {
            res.json(docs);
        });
    });
});

//Review update from conference page
app.put('/rest/conf/update/:id', function (req, res) {
    console.log(req.body)
    delete req.body._id;
    Conf.update({ _id: req.params.id }, req.body, function (err, count) {
        Conf.find(function (err, docs) {
            res.json(docs);
        });
    });
});


// Home search page
app.get('/rest/search/:city', function (req, res) {
    Conf.find({ city: req.params.city }, function (err, docs) {
        res.json(docs);

    })
});
//conf page
app.get('/rest/conference/:id', function (req, res) {
    Conf.find({ _id: req.params.id }, function (err, docs) {
        res.json(docs);
    })
});
//talk page
app.get('/rest/talk/:id', function (req, res) {
    Conf.find({ _id: req.params.id }, function (err, docs) {
        res.json(docs);
    })
});
// admin
app.post('/rest/conference', function (req, res) {
    console.log(req.body)
    var conf = new Conf(req.body);
    conf.save(function (err, doc) {
        Conf.find(function (err, docs) {
            res.json(docs);
        })
    });
});

// User METHODS
app.get('/rest/userprofile/:id', function (req, res) {
    User.findOne({ _id: req.params.id }, function (err, docs) {
        res.json(docs);
    })
});
app.post('/rest/user', function (req, res) {
    var user = req.body;
    console.log(user.name)
    User.findOne({ name: user.name }, function (err, user) {
        if (err) { console.log(err); return next(err); }
        if (user) {
            res.json(null);
            return;
        }
        var user = new User(req.body);
        user.save(function (err, doc) {
            req.login(user, function (err) {
                if (err) { return next(err); }
                res.json(user);
            });
        });
    });
});
app.put('/rest/userupdate/:id', function (req, res) {
    delete req.body._id;
    console.log(req.params.id);
    console.log("ewofuvbweouvbouwebv" + req.body)
    User.update({ _id: req.params.id }, req.body, function (err, count) {
        console.log(err);
        User.find(function (err, docs) {
            res.json(docs);
        });
    });

});
// user update talk
app.put('/rest/talks/update/:id', function (req, res) {
    console.log(req.body)
    delete req.body._id;
    Conf.update({ _id: req.params.id }, req.body, function (err, count) {
        Conf.find(function (err, docs) {
            res.json(docs);
        });
    });
});


//Mytalk rest to find talks
app.get('/rest/mytalks/:id', function (req, res) {
    User.findOne({ _id: req.params.id }, function (err, docs) {
        res.json(docs);
    })
});


// To list all users
app.get('/rest/users/', function (req, res) {
    User.find(function (err, docs) {
        res.json(docs);
    })
});


app.post('/rest/payment/', function (req, res) {
    console.log(req.body)
    var pay = new Payment(req.body);
    pay.save(function (err, doc) {
        Payment.find(function (err, docs) {
            res.json(docs);
        })
    });
});

var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port, ip);
