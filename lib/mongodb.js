const { MongoClient } = require("mongodb");

mongoURL = process.env.MONGO_URL,
mongoURLLabel = mongoURL;

const client = new MongoClient(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
  connectToServer: function (callback) {
    console.log("connecting to mongo at "+mongoURL);
    client.connect(function (err, db) {
      console.log("Got back "+db);
      if (err || !db) {
        console.log('MongoURL invalid: %s', mongoURLLabel);
        return callback(err);
      }

      dbConnection = db.db('cmurp');

      console.log('Connected to MongoDB at: %s', mongoURLLabel);

      return callback();
    });
  },

  getDb: function () {
    return dbConnection;
  },

  getCollection: function (collectionName, callback) {
    var collectionExists = dbConnection.listCollections({name:collectionName})
    .next(function(err, collinfo) {
      if (!collinfo) {
        console.log(collectionName+" collection doesn't exist. Creating...");
        dbConnection.createCollection(collectionName, function(err, res) {
          if (err) throw err;
            console.log("Collection "+collectionName+" created!");
          });
      }
    });
    return callback(dbConnection.collection(collectionName));
  }
};