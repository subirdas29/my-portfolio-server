// Auth middleware — currently commented out in the compiled dist, kept here for reference
// import { NextFunction, Request, Response } from 'express';
// import catchAsync from '../utils/catchAsync';
// import AppError from '../errors/AppError';
// import httpStatus from 'http-status';
// import config from '../config';
// import { JwtPayload } from 'jsonwebtoken';
// import { verifyToken } from '../modules/auth/auth.utils';

// const auth = (...requiredRoles: string[]) => {
//   return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const token = req.headers.authorization;
//     if (!token) {
//       throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
//     }
//     let decoded;
//     try {
//       decoded = verifyToken(token, config.jwt_access_secret as string);
//     } catch (err) {
//       throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
//     }
//     const { email, role } = decoded;
//     if (requiredRoles && !requiredRoles.includes(role)) {
//       throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
//     }
//     req.user = decoded as JwtPayload;
//     next();
//   });
// };

// export default auth;

export {};
