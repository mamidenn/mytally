import { MongoClient } from "mongodb";

export const mongoClient = new MongoClient(process.env.CONNECTION_STRING!);
