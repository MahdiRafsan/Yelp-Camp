const express = require("express");

const { NotFoundError } = require("./errors");
const errorMiddleware = require("./middlewares/errorMiddleware");

const userAuth = require("./routes/auth");
const user = require("./routes/user");
const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

const app = express();

const apiPrefix = "/api/v1";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`${apiPrefix}/auth`, userAuth);
app.use(`${apiPrefix}/user`, user);
app.use(`${apiPrefix}/campgrounds`, campgrounds);
app.use(`${apiPrefix}/campgrounds/:campgroundId/reviews`, reviews);

app.get(`${apiPrefix}`, async (req, res) => {
  res.status(200).json({ Status: "OK" });
});

app.all("*", (req, res, next) => {
  err = new NotFoundError(
    `Can't find the route ${req.originalUrl} on this server!`
  );
  next(err);
});

app.use(errorMiddleware);

module.exports = app;

// app.engine('ejs', ejsMate);
// app.set('view engine', 'ejs')
// app.set('views', path.join(__dirname, 'views'))

// app.use(express.static(path.join(__dirname, 'public')))
// app.use(express.urlencoded({extended:true}))
// app.use(methodOverride("_method"))
// app.use(session({
//     name: 'session', // good practice to change default session name to prevent people from stealing info
//     secret: "secret_key",
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         httpOnly: true, // cookies can only be changed over http
//         // secure: true, // says cookies can only be changed over https
//         expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // cookie expires in 1 week
//         maxAge: 1000 * 60 * 60 * 24 * 7
//     }
// }))

// app.use(mongoSanitize());
// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// app.use(flash())
// app.use((req, res, next) => {
//     res.locals.success = req.flash('success');
//     res.locals.error = req.flash('error');
//     res.locals.currentUser = req.user;
//     next()
// })

// routers
// app.use('/campgrounds/:id/reviews', reviews);
