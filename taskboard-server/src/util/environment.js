const dotenv = require("dotenv");

dotenv.config({
	path: ".env",
});

const {
	PORT = 3001,
	NODE_ENV = "development",
	PROD = NODE_ENV === "production",
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

module.exports = {
	PORT,
	NODE_ENV,
	PROD,
	CLIENT_DOMAIN,
	MONGO_URL,
	REDIS_HOST,
	REDIS_PORT,
	SESSION_SECRET,
	USER_LIMIT,
	BOARD_LIMIT,
	COLUMN_LIMIT,
	TASK_LIMIT,
};
