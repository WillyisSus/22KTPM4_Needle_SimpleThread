require('dotenv').config();
// const path = require('path');
const express = require('express');
const multer = require('multer')
const upload = multer({ dest: "images/" })
const app = express();
const port = 3000;
const expressHbs = require('express-handlebars');
const cors = require('cors')
//const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require('express-flash');
const passport = require('passport');

// cấu hình giao thức
console.log(__dirname)
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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "hbs");
app.listen(port, () => console.log(`Example app listening on port ${port}`))
app.use("/thread", require('./router/threadRouter'))
app.get("/", (req, res) => res.render("home-feed"));
app.get("/home-feed", (req, res) => {
    res.locals.threads = [{ username: "jenny" }, { username: "penny" }]
    res.render("home-feed")
});
app.get("/for-you-page", (req, res) => res.render("for-you-page"));

app.use("/cur-profile", require("./routes/curProfileRouter"));
app.use("/profile", require("./routes/profileRouter.js"));
app.get("/greetings", (req, res) => res.render("index", { layout: "logged-out-layout" }));
//app.get("/login", (req, res) => res.render("login", { layout: "logged-out-layout" }));
//app.get("/signup", (req, res) => res.render("signup", { layout: "logged-out-layout" }));
//app.get("/forgot-password", (req, res) => res.render("forgotpw", { layout: "logged-out-layout" }));
app.get("/notifications", (req, res) => res.render("notifications"));
app.get("/thread", (req, res) => res.render("thread"));

app.use("/auth", require('./router/authRouter'));
