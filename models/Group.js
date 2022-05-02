const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSchema = new Schema({
	name: { type: String, required: [true, "name is required"] },
	members: { type: Schema.Types.Array, required: false },
});

module.exports = mongoose.model('group', groupSchema);