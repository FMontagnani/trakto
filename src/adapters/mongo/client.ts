import { Db, MongoClient, MongoClientOptions } from 'mongodb';
import { UUID } from 'bson'

let db: Db;

const options: MongoClientOptions = {
  compressors: ['zlib'],
  pkFactory: {
    createPk: () => new UUID().toBinary(),
  }
}

const connectToMongoDB = async (uri: string = process.env.MONGODB_URI as string || 'mongodb://localhost:27017/trakto', dbName: string = process.env.MONGODB_DB_NAME as string || 'trakto') => {
  try {
    const client = new MongoClient(uri, options);
    await client.connect();
    console.log(`Connected to MongoDB at ${uri}`);
    return client.db(dbName);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

export const getDB = async (uri?: string, dbName?: string): Promise<Db> => {
  if (!db) {
    db = await connectToMongoDB(uri, dbName);
  }
  return db;
};