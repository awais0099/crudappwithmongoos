const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sequelize = require('./database/database');
const mongoose = require('mongoose');
const session = require('express-session');
const mongodb_session = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const csrf = require('csurf');
const port = 3000;
const MONGODB_URI = 'mongodb://localhost:27017/test';

// Import the user model we have defined
const Student = require('./models/Student');
const User = require('./models/User');

const app = express();

const mongodb_sesion_store = new mongodb_session({
    url: MONGODB_URI,
    collection: 'sessions',
});

const csrfProtection = csrf();

// apply express-flash-message middleware
app.use(flash());

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: mongodb_sesion_store,
}));
app.use(csrfProtection);

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next(); 
});

// Load student routes
const studentRoute = require('./routes/studentRoute');
app.use(studentRoute);

app.listen(port, () => {
    mongoose
        .connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then((result) => {
            console.log("mongoose Connection successfull...");
        }).catch((error) => {
            console.log('***********'+error);
        });
    console.log(`Example app listening at http://localhost:${port}`)
})

