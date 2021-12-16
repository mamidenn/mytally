import { MongoClient } from "mongodb";

const connectionString = process.env.CONNECTION_STRING!;

let client;
export let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(connectionString);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(connectionString);
  clientPromise = client.connect();
}
