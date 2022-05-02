const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
	name: { type: String, required: [true, "Name is required"]},
	year: { type: String, required: [true, "String is required"] },
	// interests: {
	// 	type: Schema.Types.Array,
	// 	required: [true, "interests is required"],
	// },
	// friends: { type: Schema.Types.Array, required: [false] },
	email: {
		type: String,
		required: [true, "email address is required"],
		unique: [true, "this email address has been used"],
	},
	password: { type: String, required: [true, "password is required"] },
});

//hashes password before user is saved
userSchema.pre("save", function (next) {
	let user = this;
	if (!user.isModified("password")) return next();
	bcrypt
		.hash(user.password, 10)
		.then((hash) => {
			user.password = hash;
			next();
		})
		.catch((err) => next(error));
});

//compares password against hashed password
userSchema.methods.comparePassword = function (inputPassword) {
	let user = this;
	return bcrypt.compare(inputPassword, user.password);
};

//makes sure the email is a uncc email
userSchema.methods.validateEmail = function (email) {
	
}

module.exports = mongoose.model("user", userSchema);
