/*
import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
    });
};

export default errorHandler;
*/
export {};
// This file is intentionally left empty. It is a placeholder for the error handling middleware.