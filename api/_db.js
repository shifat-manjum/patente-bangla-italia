import { MongoClient } from 'mongodb';

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://khshifatmanjum_db_user:Dtmkv5WKtSMqpTEh@cluster0.h8ljzpx.mongodb.net/patente_bangla?retryWrites=true&w=majority';

const DB_NAME = 'patente_bangla';

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so the MongoClient is not repeated
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, reuse cached client
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
}

export async function getDb() {
  const connectedClient = await clientPromise;
  return connectedClient.db(DB_NAME);
}

export async function getCollection(name) {
  const db = await getDb();
  return db.collection(name);
}
