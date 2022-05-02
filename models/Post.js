const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
	title: { type: String, required: [true, "title is required"] },
	text: { type: String, required: [true, "text is required"] },
	GroupID: {
		type: Schema.Types.ObjectId,
		ref: "group",
		required: false,
	},
	Author: {
		type: Schema.Types.ObjectId,
		required: [true, "Author is required"],
	},
});

module.exports = mongoose.model("post", PostSchema);
