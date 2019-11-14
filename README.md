# CRON | Mongo Backup

CRON scheduler that backup mongo databases.

### Installation

This project requires [Node.js](https://nodejs.org/) to run.

Install the dependencies and devDependencies and start the server.
```sh
$ cd mongo-backup
$ npm install
```

Then create a new file ```.env``` and copy the variables inside ```env.example``` file.
```sh
# MONGO DB CREDENTIALS
DB_NAME=
DB_HOST=
DB_USERNAME=
DB_PASSWORD=
DB_PORT=

# AWS CREDENTIALS
AWS_ACCESSKEY=
AWS_SECRETKEY=
AWS_REGION=

# S3 CONFIG
S3_ACCESSPERM=private
S3_BUCKETNAME=
S3_DIRECTORY=
```

Add the credentials for the variables so that you're good to go.
To start the app:
```
$ npm run start
```
License
----

MIT