import dotenv from 'dotenv';

dotenv.config();

export interface Config {
  port: number;
  mongodb: {
    uri: string;
    dbName: string;
  };
  aws: {
    region: string;
    s3: {
      bucket: string;
      endpoint: string;
      credentials: {
        accessKeyId: string;
        secretAccessKey: string;
      }
    }
  };
}

export default {
  port: Number(process.env.PORT) || 3000,
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/trakto',
    dbName: process.env.MONGODB_DB_NAME || 'trakto'
  },
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    s3: {
      bucket: process.env.AWS_S3_BUCKET || 'trakto',
      endpoint: process.env.S3_ENDPOINT_URL || 'https://s3.amazonaws.com',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',  
      }
    }
  }
};
