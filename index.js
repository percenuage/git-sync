const cron = require('node-cron');
require('dotenv').config();

const sync = require('./src/sync');

if (process.env.CRONTAB) {
    cron.schedule('* * * * *', sync);
} else {
    sync();
}


