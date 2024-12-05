import { Response, Request } from 'express';
import { validationResult, ValidationError } from 'express-validator';
import statusCode from './httpStatusCode';
import jwt from 'jsonwebtoken';

interface PaginatedResponse<T> {
  list: T[];
  page: number;
  limit: number;
  totalCount: number;
  totalPage: number;
}

class Services {
  static sendSuccess = async (
    res: Response,
    message: string,
    payload: any
  ): Promise<void> => {
    return Services.setResponse(res, statusCode.SUCCESSFUL, message, payload);
  };

  static response = (
    code: number,
    message: string,
    data: any = null
  ): { status: number; message: string; responseData?: any } => {
    if (data == null) {
      return {
        status: code,
        message: message,
      };
    } else {
      return {
        status: code,
        message: message,
        responseData: data,
      };
    }
  };

  static setResponse = async (
    res: Response,
    statusCode: number,
    message: string,
    data: any
  ): Promise<void> => {
    await res.send(this.response(statusCode, message, data));
  };

  static hasValidatorErrors = (req: Request, res: Response): boolean => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const msg = 'Validation Failed';
      this.setResponse(res, statusCode.BAD_REQUEST, msg, errors.array());
      return true;
    } else {
      return false;
    }
  };

  static userTokenGenerate = async (
    payload: object,
    expireTime: string | number
  ): Promise<string> => {
    const token = jwt.sign(payload, process.env.SECURITY_KEY!, {
      expiresIn: expireTime,
    });
    return token;
  };

  static jwtVerify = (token: string): any => {
    try {
      const verifyUser = jwt.verify(token, process.env.SECURITY_KEY!);
      return verifyUser;
    } catch (error) {
      throw error;
    }
  };

  static regexSearch = (search: string | undefined, keys: string[]): object => {
    let filter: any = { isDeleted: false };

    if (search) {
      filter.$or = keys.map((key) => {
        return {
          [key]: {
            $regex: search,
            $options: 'i',
          },
        };
      });
    }
    return filter;
  };

  static paginationAndSorting = (
    query: any,
    defaultSortField: string
  ): { page: number; skipRecord: number; limit: number; sortObj: object } => {
    const { pageNumber, perPage, sortField, sortType } = query;
    let page = pageNumber ? parseInt(pageNumber) : 1;
    let limit = perPage ? parseInt(perPage) : 10;
    // Sorting
    let sortObj =
      sortField && sortType == 'asc'
        ? { [sortField]: 1 }
        : sortField && sortType == 'desc'
        ? { [sortField]: -1 }
        : { [defaultSortField]: -1 };
    return {
      page,
      skipRecord: (page - 1) * limit,
      limit,
      sortObj,
    };
  };

  static paginateResponse = (
    data: any[],
    { page, limit }: { page: number; limit: number },
    totalRecord: number
  ): PaginatedResponse<any> => {
    const dataList: PaginatedResponse<any> = {
      list: data,
      page: page,
      limit: limit,
      totalCount: totalRecord,
      totalPage: Math.ceil(totalRecord / limit),
    };
    return dataList;
  };
}

export default Services;


