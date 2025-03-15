import { createLogger, format, transports } from 'winston';

const logFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message, ...meta }) => {
        const metaString = Object.keys(meta).length ? JSON.stringify(meta) : '';
        return `${timestamp} [${level}]: ${message} ${metaString}`;
    })
);

const logger = createLogger({
    level: 'info',

    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                logFormat
            )
        }),
        new transports.File({
            filename: 'app.log',
            format: format.combine(
                format.colorize(),
                logFormat
            )
        })
    ]
});

export default logger;
