const express = require("express");
const redis = require("redis");
const connectRedis = require("connect-redis");
const session = require("express-session");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const {
	PORT,
	CLIENT_DOMAIN,
	MONGO_URL,
	REDIS_HOST,
	REDIS_PORT,
	SESSION_SECRET,
	PROD,
} = require("./util/environment");
const apiresponse = require("./middlewares/apiresponse");
const log = require("./util/logger");
const userRoutes = require("./routes/user");
const boardRoutes = require("./routes/board");
const columnRoutes = require("./routes/column");
const taskRoutes = require("./routes/task");

const RedisStore = connectRedis(session);
const redisClient = redis.createClient({
	host: REDIS_HOST,
	port: REDIS_PORT,
});

const app = express();

//adding logging middleware
app.use(morgan(PROD ? "combined" : "dev"));

/*
    Adding cors, form-body and json middlewares
    going to use cookies so setting credentials to true, and allowing fixed origin
*/
app.use(
	cors({
		credentials: true,
		origin: CLIENT_DOMAIN,
	})
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//use session middleware
app.use(
	session({
		store: new RedisStore({
			client: redisClient,
		}),
		secret: SESSION_SECRET,
		saveUninitialized: false,
		resave: false,
		cookie: {
			httpOnly: true,
			secure: PROD,
			maxAge: PROD ? 1000 * 60 * 60 * 24 : 1000 * 60 * 60 * 24 * 30, // if production, 1 day, else 1 month :)
		},
	})
);

app.use(apiresponse);

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/boards", boardRoutes);
app.use("/api/v1/columns", columnRoutes);
app.use("/api/v1/tasks", taskRoutes);

app.use((_, res) => res.sendAPIStatus(404));

const startServer = async () => {
	try {
		await mongoose.connect(MONGO_URL);
		log.info("connected to mongo");
		await redisClient.ping();
		log.info("connected to redis");
		app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
	} catch (error) {
		log.error(error);
	}
};

startServer();
