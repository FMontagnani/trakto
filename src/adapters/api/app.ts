import express from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import { makeTaskRouter } from './routes'
import config from '@config/environment';
import { getDB } from '@adapters/mongo';
import { Db } from 'mongodb';

const createExpressApp = (db: Db) => {
    const app = express();

    // Middleware
    app.use(cors());
    app.use(helmet());
    app.use(json());
    app.use(urlencoded({ extended: true }));

    // Routes
    app.use('/api', makeTaskRouter(db));

    return app;
};

const startServer = async (port: number) => {
    const db = await getDB()
    const app = createExpressApp(db);


    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

startServer(Number(config.port)).catch((error) => {
    console.error('Error starting server:', error);
    process.exit(1);
});
