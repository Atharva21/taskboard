const { model, Schema } = require("mongoose");

const taskSchema = new Schema({
	content: {
		type: String,
		required: true,
	},
});

module.exports = model("task", taskSchema);
