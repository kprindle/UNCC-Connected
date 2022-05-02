const model = require("../models/Group");
const post = require("../models/Post");
const user = require("../models/user");

exports.yourGroups = (req, res, next) => {
	let user = req.session.user;
	model
		.find()
		.then((groups) => res.render("./group/yourGroups", { groups, user }))
		.catch((err) => next(err));
};

exports.allGroups = (req, res, next) => {
	model
		.find()
		.then((groups) => res.render("./group/allGroups", { groups }))
		.catch((err) => next(err));
};

//function to rcreate new group create a new Group
exports.new = (req, res, next) => {
	res.render("./group/new");
};

exports.create = (req, res, next) => {
	let group = new model(req.body);
	group.members.push(req.session.user);
	group
		.save()
		.then((group) => res.redirect("/group"))
		.catch((err) => {
			if (err.name === "ValidationError") {
				req.flash("error", err.message);
				return res.redirect("/back");
			}
			next(err);
		});
};

exports.showGroup = (req, res, next) => {
	let id = req.params.id;
	let user = req.session.user;
	post
		.find()
		.then((posts) => {
			model
				.findById(id)
				.then((group) => {
					if (group) {
						return res.render("./group/groupPage", { group, user, posts });
					} else {
						let err = new Error("Cannot find a group with id " + id);
						err.status = 404;
						next(err);
					}
				})
				.catch((err) => next(err));
		})
		.catch((err) => next(err));

	// model
	// 	.findById(id)
	// 	.then((group) => {
	// 		if (group) {
	// 			return res.render("./group/groupPage", { group, user });
	// 		} else {
	// 			let err = new Error("Cannot find a group with id " + id);
	// 			err.status = 404;
	// 			next(err);
	// 		}
	// 	})
	// 	.catch((err) => next(err));
};

exports.newMember = (req, res, next) => {};

//function to add a member to that group
exports.joinGroup = (req, res, next) => {
	let id = req.params.id;
	let user = req.session.user;
	model
		.findById(id)
		.then((group) => {
			if (group) {
				group.members.push(req.session.user);
				console.log("Push memebrs");
				group
					.save()
					// console.log("save group")
					.then((group) => {
						post
							.find()
							.then((posts) =>
								res.render("./group/groupPage", { group, posts, user })
							);
					})
					.catch((err) => {
						if (err.name === "ValidationError") {
							req.flash("error", err.message);
							return res.redirect("/back");
						}
						next(err);
					});
			} else {
				let err = new Error("Cannot find a group with id " + id);
				err.status = 404;
				next(err);
			}
		})
		.catch((err) => next(err));
};
