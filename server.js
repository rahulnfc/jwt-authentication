const express = require('express');
const path = require('path');
const app = express();
const dotenv = require('dotenv');
const logger = require('morgan');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const db = require('./config/database/connection');
const applicantRouter = require('./routes/applicant');
const companyRouter = require('./routes/company');
const adminRouter = require('./routes/admin');

// dotenv config
dotenv.config();

// view engine setup
require('ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session
app.use(session({ secret: 'secret', resave: true, saveUninitialized: false }));
app.use(flash());

// db connection
db.connect((err) => {
    if (err) console.log('connction error', err);
    else console.log('Database connected 💯💯💯');
});

// passport config
require('./config/authentication/applicantPassport')(passport);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// routers
app.use('/', applicantRouter);
app.use('/', companyRouter);
app.use('/', adminRouter);

app.get("*", (req, res) => {
    res.status(404).send('404 page not found');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));