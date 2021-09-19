const dotenv = require("dotenv");

dotenv.config({
	path: ".env",
});

module.exports = {
	PORT = 3001,
	NODE_ENV = "development",
	CLIENT_DOMAIN = "http://localhost:5000",
	MONGO_URL = "mongodb://localhost:27017/test",
	REDIS_HOST = "127.0.0.1",
	REDIS_PORT = 6379,
	SESSION_SECRET,
	USER_LIMIT = 50,
	BOARD_LIMIT = 2,
	COLUMN_LIMIT = 5,
	TASK_LIMIT = 10,
} = process.env;

exports.PROD = NODE_ENV === "production";
