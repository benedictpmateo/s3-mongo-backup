/**
 * @author Benedict Mateo <benedictpmateo@gmail.com>
 * @description Backup Database using task scheduler
 */
const dotenv = require('dotenv');
const MBackup = require('s3-mongo-backup');
const cron = require('node-cron');
const moment = require('moment');
const colors = require('colors/safe');

dotenv.config({ path: '.env' });

/**
 * @description configuration for MongoBackup
 */
var backupConfig = {
    mongodb: {
        "database": process.env.DB_NAME,
        "host": process.env.DB_HOST,
        "username": process.env.DB_USERNAME,
        "password": process.env.DB_PASSWORD,
        "port": process.env.DB_PORT
    },
    s3: {
        // AWS Crendentials
        accessKey: process.env.AWS_ACCESSKEY,
        secretKey: process.env.AWS_SECRETKEY,
        region: process.env.AWS_REGION,

        // S3 Bucket Privacy and directory for the uploaded database
        accessPerm: process.env.S3_ACCESSPERM || 'private', 
        bucketName: `${process.env.S3_BUCKETNAME}/${process.env.S3_DIRECTORY}`,
    },
    // If true, It'll create a folder in project root with database's name and store backups in it and if it's false, It'll use temporary directory of OS
    keepLocalBackups: process.env.KEEPLOCALBACKUPS,

    // This will only keep the most recent 5 backups and delete all older backups from local backup directory
    noOfLocalBackups: process.env.NOOFLOCALBACKUPS,

    // Timezone, It is assumed to be in hours if less than 16 and in minutes otherwise
    timezoneOffset: process.env.TIMEZONEOFFSET
};

const hour = process.env.TIME_HR;
const min = process.env.TIME_MIN;
const sec = process.env.TIME_SEC;
const time = `${hour}:${min}:${sec}`

console.log(`${colors.green('#')} BACKUP TIME: ${colors.cyan(time)}`);
console.log(`${colors.green('#')} SERVER TIME: ${colors.cyan(moment().format('HH:mm:ss'))}`);

cron.schedule('* * * * * *', async () => {
    if (moment().format('HH:mm:ss') === time) {
        var timer = (function() {
            var P = ["\\ Uploading...", "| Uploading...", "/ Uploading...", "- Uploading..."];
            var x = 0;
            return setInterval(() => {
                process.stdout.write("\r" + P[x++]);
                x &= 3;
            }, 250);
        })();
        console.log(`\n${colors.green('#')} ${colors.magenta('Backup started...')}`);
        console.log(`\n${colors.green('#')} Database Credentials:`);
        await MBackup(backupConfig).then(onResolve => {
            clearInterval(timer);
            process.stdout.write('\r' + colors.green('# Uploaded Successfull!!'));
            console.log();
        }, onReject => {
            clearInterval(timer);
            process.stdout.write('\r' + `${colors.green('# ')} ${colors.red('Error occurred.')}`);
            console.log(onReject);
        });
    }
})
