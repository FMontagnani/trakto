import { Request, Response, NextFunction } from 'express';

function isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}

// Middleware for validating UUID parameters
export const validateUUIDParamMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { params } = req;

    const paramsKeys = Object.keys(params);

    const errors = paramsKeys.reduce<string[]>((acc, key) => {
      if (/Id/.test(key)) {
        if (!isValidUUID(params[key])) {
          acc.push(key);
        }
      }
      return acc;
    }, [] as string[]);

    if (errors.length > 0) {
      return res.status(400).json({ error: `Invalid parameter(s) provided, please check the api documentation` });
    }
  
    next();
};
