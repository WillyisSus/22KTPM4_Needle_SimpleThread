require('dotenv').config();
// const path = require('path');
const express = require('express');
const app = express();
const port = 3000;
const expressHbs = require('express-handlebars');
const cors = require('cors')
//const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require('express-flash');
const passport = require('passport');
const xssClean = require('xss-clean');
//const helmet = require('helmet');

// cấu hình giao thức
console.log(__dirname)
console.log(process.env.APP_EMAIL)
app.use(express.static(__dirname + "/html"));
app.engine('hbs', expressHbs.engine({
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    extname: "hbs",
    defaultLayout: "logged-in-layout",
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    },
    helpers: {
        formatDate: (data) => {
            return data.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        }
    }
}));

var Handlebars = expressHbs.create({}).handlebars;
Handlebars.registerHelper('switch', function (value, options) {
    this.switch_value = value;
    return options.fn(this);
});
Handlebars.registerHelper('case', function (value, options) {
    if (value == this.switch_value) {
        return options.fn(this);
    }
});
Handlebars.registerHelper('if', function (value, options) {
    if (value != "deleted") {
        return options.fn(this);
    }
});


app.use(express.json());
app.use(xssClean());
app.use(express.urlencoded({ extended: false }));
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 86400000 }
}));
app.use(passport.initialize());
app.use(passport.session());
function checkAuthentication(req, res, next){
    if (req.isAuthenticated() || req.path.startsWith('/auth')){
        return next()
    }
    res.redirect('/auth/login')
}
function checkNotAuthentication(req, res, next){
    if (req.isAuthenticated()){
        return res.redirect('/')
    }
    next();
}

app.set("view engine", "hbs");
app.listen(port, () => console.log(`Example app listening on port ${port}`))
app.use("/thread", require('./router/threadRouter'))
app.get("/", (req, res) => res.render("home-feed"));
app.get("/home-feed", (req, res) => {
    res.render("home-feed")
});
app.get("/for-you-page", (req, res) => res.render("for-you-page"));

app.use("/cur-profile", require("./router/curProfileRouter.js"));
app.use("/profile", require("./router/profileRouter.js"));
app.get("/greetings", checkNotAuthentication,  (req, res) => res.render("index", { layout: "logged-out-layout" }));
//app.get("/login", (req, res) => res.render("login", { layout: "logged-out-layout" }));
//app.get("/signup", (req, res) => res.render("signup", { layout: "logged-out-layout" }));
//app.get("/forgot-password", (req, res) => res.render("forgotpw", { layout: "logged-out-layout" }));
app.get("/thread/:thread_id", (req, res) => {
    res.locals.thread_id = req.params.thread_id;
    res.render("thread");
});

//app.get("/notifications", (req, res) => res.render("notifications"));

app.use("/notifications", require('./router/notificationRouter'));
app.use("/auth", require('./router/authRouter'));
