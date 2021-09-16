const { model, Schema } = require("mongoose");

const columnSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	taskIds: {
		type: Array,
		default: [],
	},
});

module.exports = model("column", columnSchema);
