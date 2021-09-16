const { model, Schema } = require("mongoose");

const userSchema = new Schema(
	{
		username: {
			type: String,
			unique: true,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		email: String,
		boardIds: {
			type: Array,
			default: [],
		},
	},
	{
		timestamps: true,
	}
);

module.exports = model("user", userSchema);
