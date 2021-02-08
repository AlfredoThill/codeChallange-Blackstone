const MongoClient = require('mongodb').MongoClient;

// Setting DB credentials as env variables, for this app we are using
// a collection and a single user. If we are deploying on Heroku we
// gonna set env variables there and drop dotenv. 
require('dotenv').config();
const db_user = process.env.DB_USER;
const db_pwd = process.env.DB_PASS;

// # This helpers just build the mongo client and keeps the conection open
let client = async function() {
   try { 
    const uri = 'mongodb+srv://' + db_user + ':' + db_pwd +'@cluster0-luguo.gcp.mongodb.net/codeChallange?ssl=true&authSource=admin&w=majority';
    const client = new MongoClient(uri, { useNewUrlParser: true }); // App crashing on heruku with 'useUnifiedTopology: true'
    console.log("NOTE: App crashing on heruku with 'useUnifiedTopology: true'");
    await client.connect();
    return client
   }
   catch (e) {
      // Not really catching this..
      console.log(e)
   }
}

module.exports = client;