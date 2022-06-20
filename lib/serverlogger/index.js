const winston = require("winston");
const { combine, timestamp, printf } = winston.format;
const path = require("path");

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = winston.createLogger({
  level: "error",
  format: combine(timestamp(), myFormat),
  transports: [
    new winston.transports.File({
      filename: path.join(process.cwd(), "log", "info.log"),
      level: "info",
      maxsize: 5242880,
      maxFiles: 2,
    }),
    new winston.transports.File({
      filename: path.join(process.cwd(), "log", "error.log"),
      level: "error",
      maxsize: 5242880,
      maxFiles: 2,
    }),
    new winston.transports.File({
      filename: path.join(process.cwd(), "log", "http.log"),
      level: "http",
      maxsize: 5242880,
      maxFiles: 2,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(process.cwd(), "log", "exceptions.log"),
    }),
  ],
  exitOnError: false,
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export default logger;
