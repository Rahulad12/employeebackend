// const { createLogger, format, transports } = require("winston");
import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf, errors } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Create Winston logger
const logger = createLogger({
  level: "info", // Defaut level is 'info'l
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }), // Include error stack trace
    logFormat
  ),
  transports: [
    new transports.Console(), // Log to console
    new transports.File({ filename: "logs/error.log", level: "error" }), // Log errors to file
    new transports.File({ filename: "logs/combined.log" }), // Log all messages to file
  ],
});

// Add a rotating log file for daily logs
// const DailyRotateFile = require("winston-daily-rotate-file");
import DailyRotateFile from "winston-daily-rotate-file";
logger.add(
  new DailyRotateFile({
    filename: "logs/application-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    maxFiles: "14d", // Keep logs for 14 days
  })
);

export default logger;
