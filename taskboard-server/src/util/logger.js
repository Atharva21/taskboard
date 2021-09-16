const winston = require("winston");
const { format } = winston;
const { PROD } = require("./environment");
const { printf } = format;

const loggerFormat = printf(({ level, message, timestamp, stack }) => {
	return `${timestamp} [${level}]: ${stack || message}`;
});

const buildDevLogger = () => {
	return winston.createLogger({
		level: "debug",
		format: format.combine(
			format.colorize(),
			format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
			format.errors({ stack: true }),
			loggerFormat
		),
		transports: [new winston.transports.Console()],
	});
};

const buildProdLogger = () => {
	return winston.createLogger({
		level: "info",
		format: format.combine(
			format.json(),
			format.timestamp(),
			format.errors({ stack: true }),
			loggerFormat
		),
		transports: [new winston.transports.Console()],
	});
};

const log = PROD ? buildProdLogger() : buildDevLogger();

module.exports = log;
