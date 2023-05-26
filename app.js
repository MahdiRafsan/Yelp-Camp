if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const app = express();
const port = 5000;
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');

const User = require('./models/user');
const AppError = require('./utils/AppError');
const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews');
const userAuth = require('./routes/auth');

// function to connect to mongo database
const connectDb = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/yelpCamp');
        console.log('CONNECTED WITH MONGO SUCCESSFULLY!');
    } catch (err) {
        console.log('SOMETHINNG WENT WRONG! CONNECTION FAILED WITH MONGO!');
        console.log(err.message);
    }    
}
connectDb()
mongoose.connection.on('error', console.error.bind(console, 'CONNECTION ERROR: '));
mongoose.connection.once('open', () => {
    console.log('MONGO DATABASE CONNECTED!')
})

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.use(session({
    name: 'session', // good practice to change default session name to prevent people from stealing info 
    secret: "secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, // cookies can only be changed over http
        // secure: true, // says cookies can only be changed over https
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // cookie expires in 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}))

app.use(mongoSanitize());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash())
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next()
})

// routers
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);
app.use('/auth', userAuth);

app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new AppError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const {status = 500} = err;
    if (!err.message) err.message = "Oh no! Something went wrong!"
    res.status(status).render('error', { err })
})

app.listen(port, () => {
    console.log(`APP IS RUNNING ON PORT ${port}.`)
})