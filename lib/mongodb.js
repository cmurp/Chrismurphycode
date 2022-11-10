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
    console.log("Connecting to mongo at "+mongoURL);
    client.connect(function (err, db) {
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
    if (!dbConnection || dbConnection === undefined) {
      this.connectToServer();
    }
    dbConnection.listCollections({name:collectionName})
      .next(function(err, collinfo) {
        if(err) {
          console.log("Error: "+err);
        }
        if (!collinfo) {
          console.log(collectionName+" collection doesn't exist. Creating...");
          dbConnection.createCollection(collectionName, function(err, res) {
            if (err) throw err;
              console.log("Collection "+collectionName+" created!");
            });
        } else{
          console.log("Found "+collinfo+" - "+collectionName);
        }
    });
    return callback(dbConnection.collection(collectionName)); 
  }
};