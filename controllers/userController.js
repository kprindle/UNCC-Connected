const model = require("../models/user");
const Group = require("../models/Group");

//gets register page
exports.new = (req, res) => {
	return res.render("./user/register");
};

//creates new user
exports.create = (req, res, next) => {
	let user = new model(req.body);
	if (user.email) user.email = user.email.toLowerCase();

    //validates Email
	let uncc = req.body.email.length;
	let limit = 9;
	uncc = uncc - limit;
	let verifyEmail = req.body.email.substring(uncc, req.body.email.length);
	if (verifyEmail != "@uncc.edu") {
		req.flash("error", "Not a valid UNCC email");
		return res.redirect("back");
	}

	user
		.save()
		.then((user) => {
			req.flash("success", "Registration succeeded!");
			res.redirect("/user/login");
		})
		.catch((err) => {
			if (err.name === "ValidationError") {
				req.flash("error", err.message);
				return res.redirect("back");
			}

			if (err.code === 11000) {
				req.flash("error", "Email has been used");
				return res.redirect("back");
			}
			next(err);
		});
};

//gets user login page
exports.loginPage = (req, res, next) => {
	return res.render("./user/login");
};

//logs in user
exports.login = (req, res, next) => {
	let email = req.body.email;
	if (email) {
		email = email.toLowerCase();
	}
	let password = req.body.password;
	model
		.findOne({ email: email })
		.then((user) => {
			if (!user) {
				req.flash("error", "wrong email address");
				res.redirect("/users/login");
			} else {
				user.comparePassword(password).then((result) => {
					if (result) {
                        req.session.user = user._id;
					} else {
						req.flash("error", "wrong password");
						res.redirect("/users/login");
					} if(req.session.user = user._id) {
                        Group.find().then((groups) => {
						res.render("./group/allGroups", { groups, user });    
                        })
						.catch((err) => next(err))
                    }
				});
			}
		})
		.catch((err) => next(err))
};

//gets users profile page
exports.profile = (req, res, next) => {
	let id = req.session.user;
	Promise.all([
		model.findById(id),
		connection.find({ author: id }),
		rsvp.find({ user: id }).populate("connection"),
	])
		.then((results) => {
			const [user, connections, rsvps] = results;
			res.render("./user/profile", { user, connections, rsvps });
		})
		.catch((err) => next(err));
};

//logs out user
exports.logout = (req, res, next) => {
	req.session.destroy((err) => {
		if (err) return next(err);
		else res.redirect("/");
	});
};
