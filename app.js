//require modules
const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const groupRoutes = require("./routes/groupRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");

//create application
const app = express();

//configure app
let port = 3001;
let host = "localhost";
app.set("view engine", "ejs");

//connect to mongoose server
mongoose
	.connect(
		"mongodb+srv://kprindle:Kp48Masters_@unccconnected.kb8bs.mongodb.net/UNCCCOnnected?retryWrites=true&w=majority",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => {
		app.listen(port, host, () => {
			console.log("Server is running on port", port);
		});
	})
	.catch((err) => console.log(err.message));

//mount middleware
app.use(
	session({
		secret: "ajfeirf90aeu9eroejfoefj",
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({
			mongoUrl:
				"mongodb+srv://kprindle:Kp48Masters_@unccconnected.kb8bs.mongodb.net/UNCCCOnnected?retryWrites=true&w=majority",
		}),
		cookie: { maxAge: 60 * 60 * 1000 },
	})
);

//flash pop ups
app.use(flash());

app.use((req, res, next) => {
	res.locals.user = req.session.user || null;
	res.locals.errorMessages = req.flash("error");
	res.locals.successMessages = req.flash("success");
	next();
});

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(methodOverride("_method"));

//set up routes
app.get("/", (req, res) => {
	res.render("index");
});
app.use("/group", groupRoutes);
app.use("/post", postRoutes);
app.use("/user", userRoutes);

// app.get('/about', (req, res)=>{
//     res.render('About');
// })
// app.get('/contact', (req, res)=>{
//     res.render('Contact');
// })

//error handling
app.use((req, res, next) => {
	let err = new Error("The server cannot locate " + req.url);
	err.status = 404;
	next(err);
});
app.use((err, req, res, next) => {
	console.log(err.stack);
	if (!err.status) {
		err.status = 500;
		err.message = "Internal Server Error";
	}
	res.status(err.status);
	res.render("error", { error: err });
});
