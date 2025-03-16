import { NextFunction, Request, RequestHandler, Response } from 'express';

// higher order function er maddhome try catch kaj tao ekhane evabe kora jai

//ekhane request asbe

const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

export default catchAsync;
