import { Request, Response, NextFunction } from 'express';
import services from './services';
import statusCode from './httpStatusCode';
import { userModel } from '../models/index';
import { RequestError } from '../error/error';

interface JwtPayload {
  _id: string;
}

const auth = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    const headerToken = req.headers.authorization;

    if (!headerToken) {
      throw new RequestError(statusCode.UNAUTHORIZED, "Unauthorized");
    }

    const [type, token] = headerToken.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new RequestError(statusCode.UNAUTHORIZED, "Unauthorized");
    }

    const verify = services.jwtVerify(token) as JwtPayload;
    const userData = await userModel.findOne({ _id: verify._id });

    if (!userData) {
      throw new RequestError(statusCode.UNAUTHORIZED, "Unauthorized");
    }

    req.user = userData; 
    next();
  } catch (error) {
    next(error);
  }
};

export default auth;
