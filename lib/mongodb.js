var mongodb = require('mongodb');
mongoURL = process.env.MONGO_URL,
mongoURLLabel = mongoURL;

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
    var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
        mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
        mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
        mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
        mongoPassword = process.env[mongoServiceName + '_PASSWORD'],
        mongoUser = process.env[mongoServiceName + '_USER'];

    if (mongoHost && mongoPort && mongoDatabase) {
        mongoURLLabel = mongoURL = 'mongodb://';
        if (mongoUser && mongoPassword) {
            mongoURL += mongoUser + ':' + mongoPassword + '@';
        }
        // Provide UI label that excludes user id and pw
        mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
        mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;
    }
}

if (mongoURL == null) return;
if (mongodb == null) return;

mongodb.connect(mongoURL, function(err, conn) {
    if (err) {
        console.log('MongoURL invalid: %s', mongoURLLabel);
        return;
    }

    module.exports.db = conn;

    console.log('Connected to MongoDB at: %s', mongoURLLabel);
});

module.exports.mongodb = mongodb;
