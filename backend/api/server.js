require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
// const path = require('path');
// const methodOverride = require('method-override');
// const ejsMate = require('ejs-mate');
// const session = require('express-session');
// const flash = require('connect-flash');
// const passport = require('passport');
// const LocalStrategy = require('passport-local');
// const mongoSanitize = require('express-mongo-sanitize');

// const User = require('./models/user');
// const AppError = require('./utils/AppError');
// const reviews = require('./routes/reviews')

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Uncaught Exception occurred! Shutting down....");
  process.exit(1);
});

const app = require("./app");
const port = process.env.PORT || 5000;

process.env.NODE_ENV === "production"
  ? connectDB(process.env.MONGO_DB_PRODUCTION_URI)
  : connectDB(process.env.MONGO_DB_DEVELOPMENT_URI);

  // const server = app.listen(port, () => {
  //   console.log(`Server is running successfully on port ${port}....`);
  // });

  // // Handle unhandled rejections
  // process.on("unhandledRejection", (err) => {
  //   console.log(err.name, err.message);
  //   console.log("Unhandled Rejection occurred! Shutting down server....");

  //   // Gracefully close the server and exit the process
  //   server.close(() => {
  //     process.exit(1);
  //   });
  // });

mongoose.connection.once("open", () => {
  console.log("MONGO DATABASE CONNECTED SUCCESSFULLY!");

  // start server upon successful database connection
  const server = app.listen(port, () => {
    console.log(`Server is running successfully on port ${port}....`);
  });

  // Handle unhandled rejections
  process.on("unhandledRejection", (err) => {
    console.log(err.name, err.message);
    console.log("Unhandled Rejection occurred! Shutting down server....");

    // Gracefully close the server and exit the process
    server.close(() => {
      process.exit(1);
    });
  });
});

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
