import { statusCode } from "../helper";

class RequestError extends Error {
  code: number;
  data?: any;

  constructor(code: number, msg: string, data?: any) {
    super(msg);
    this.code = code;
    this.data = data;

    Object.setPrototypeOf(this, RequestError.prototype);
  }
}

class BadRequestError extends RequestError {
  constructor(msg: string, data?: any) {
    super(statusCode.BAD_REQUEST, msg, data);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

class NotFoundError extends RequestError {
  constructor(msg: string, data?: any) {
    super(statusCode.NOT_FOUND, msg, data);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export { RequestError, BadRequestError, NotFoundError };
