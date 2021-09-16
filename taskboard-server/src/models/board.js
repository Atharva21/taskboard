const { model, Schema } = require("mongoose");

const boardSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		columnIds: {
			type: Array,
			default: [],
		},
	},
	{
		timestamps: true,
	}
);

module.exports = model("board", boardSchema);
