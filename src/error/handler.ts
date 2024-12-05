import { Request, Response, NextFunction } from 'express';
import { services, statusCode } from '../helper';

const send = services.setResponse;

interface CustomError extends Error {
  code?: number;
}

const errorhandler = (error: CustomError, req: Request, res: Response, next: NextFunction): any => {
  console.error('Error:', error);

  const errorObj = {
    title: error.name,
    routeName: req.path,
    errorData: {
      message: error.message,
      stack: error.stack,
    },
  };

  return send(
    res,
    error.code || statusCode.SERVER_ERROR,
    error.message || "Something went wrong",
    errorObj
  );
};

export default errorhandler;
