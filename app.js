//require modeules
const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const mainRoutes = require("./routes/mainRoutes");
const tradeRoutes = require("./routes/tradeRoutes");
const userRoutes = require("./routes/userRoutes");

const method = require("method-override");

const app = express();

let port = 3000;
let host = "localhost";
app.set("view engine", "ejs");

mongoose
  .connect("mongodb://localhost:27017/PhoneDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    //start app
    app.listen(port, host, () => {
      console.log("Server is running on port", port);
    });
  })
  .catch((err) => console.log(err.message));

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(method("_method"));

app.use(
  session({
    secret: "jksjcoqejopceuyhhsjodejdkd",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl: "mongodb://localhost:27017/PhoneDB",
    }),
    cookie: { maxAge: 60 * 60 * 1000 },
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.firstName = req.session.firstName || null;
  res.locals.lastName = req.session.lastName || null;
  res.locals.errorMessages = req.flash("error");
  res.locals.successMessages = req.flash("success");
  next();
});

app.use("/", mainRoutes);
app.use("/trades", tradeRoutes);
app.use("/users", userRoutes);

app.use((req, res, next) => {
  let err = new Error("The server cannot locate " + req.url);
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  if (!err.status) {
    err.status = 500;
    err.message = "Internal Server Error";
  }
  res.status(err.status);
  res.render("error", { error: err });
});
