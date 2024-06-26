// middleware/logger.js

const morgan = require('morgan')
const winston = require('winston')

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.printf( ( {timestamp, level, message } ) => {
            return `${timestamp}  ${level}  ${message}`
        }) 
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'combined.log' })
    ]
})

const morganMiddleware = morgan('combined', {
    stream: {
        write: message => {
            logger.info(message.trim());
        },
    },
});

module.exports = morganMiddleware;