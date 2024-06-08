

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.MONGODB_URI;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

function getAccountFromEmail(email) {
  let user =  client.db("test").collection("users").findOne({ email });
  let account = client.db("test").collection("accounts").findOne({ user: user._id });
    return account;
}

async function removeAccountFromEmail(email) {
  let user = await client.db("test").collection("users").findOne({ email });
  let account = await client.db("test").collection("accounts").findOne({ userId: user._id });
  client.db("test").collection("accounts").deleteOne({ _id: account._id });
  client.db("test").collection("users").deleteOne({ _id: user._id });
}

export { client, getAccountFromEmail, removeAccountFromEmail };