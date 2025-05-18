import { Db, MongoClient, MongoClientOptions } from 'mongodb';
import { UUID } from 'bson'

let db: Db;

const options: MongoClientOptions = {
    compressors: ['zlib'],
    pkFactory: {
        createPk: () => new UUID().toBinary(),
    }
}

const connectToMongoDB = async () => {
    try {
        const client = new MongoClient(process.env.MONGODB_URI as string || 'mongodb://localhost:27017/trakto', options);
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db();
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};

export const getDB = async (): Promise<Db> => {
    if (!db) {
        db = await connectToMongoDB();
    }
    return db;
};