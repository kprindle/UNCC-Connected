const model = require("../models/Post");
const Group = require("../models/Group");


//redirect to new post page
exports.new = (req, res) => {
	let user = req.session.user;
	let id = req.params.id;
	Group.findById(id)
		.then((group) => {
			if (group) {
				return res.render("./post/new", { group, user });
			} else {
				let err = new Error("Cannot find a group with id " + id);
				err.status = 404;
				next(err);
			}
		})
		.catch((err) => next(err));
};

//create new post and add post to the group
exports.create = (req, res, next) => {
	let id = req.params.id;
	let user = req.session.user;
	let post = new model();
	post.text = req.body.text;
	post.title = req.body.title;
	post.Author = user;
	post.GroupID = id;
	post.image = req.body.image;
	console.log(id);
	Group.findById(id)
		.then((group) => {
			if (group) {
					post
						.save()
						.then((post) => {
							model.find().then((posts) => {
								req.flash("success", "posted successfully");
								res.render("./group/groupPage", { group, user, posts });
							});
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

//delete Post
exports.delete = (req, res, next) => {
	let groupID = req.params.GroupID;
	console.log(groupID);
	let id = req. params.id;
	let user = req.session.user;
	model.findByIdAndDelete(id)
	.then((post) => {
		Group.findById(groupID)
		.then(group => {
			model.find()
			.then((posts) => {
				res.render("./group/groupPage", { group, user, posts });	
			})
		})
		
	})
	.catch((err) => next(err));
};