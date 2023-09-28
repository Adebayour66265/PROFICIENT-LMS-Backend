import { NextFunction, Request , Response} from "express";
import ErrorHandler from "../utils/ErrorHandler";

export const ErrorMiddleware = (
    err:any, 
    req:Request, 
    res:Response, 
    next:NextFunction
    )=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';

    // If something wrong with mongodb id Error
    if (err.name === 'CastError') {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // Duplicate any key Error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message, 400);
    }
    // When something wrong with JWT
    if (err.code === 'JsonWebTokenError') {
        const message = `json web token is invalid, try again`;
        err = new ErrorHandler(message, 400);
    }
    // JWT expired error
    if (err.code === 'TokenExpiredError') {
        const message = `json web token is expired, try again`;
        err = new ErrorHandler(message, 400);
    }
    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })
}