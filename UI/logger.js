var winston = require('winston');

var winston = new (winston.Logger)({  

    transports: [
        new winston.transports.Console({ level: 'debug' }),
        // new (winston.transports.File)({ filename: __dirname + '/logFile.log', level: 'debug' })
        new winston.transports.File({ filename:'./logFile.log', level: 'debug' })
    ]
});

winston.info('Dog Tracker Data - the logs are being captured logFile')

module.exports = winston;  