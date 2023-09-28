class ErrorHandler extends Error {
    statusCode: number;

    constructor(message:any, statusCode:Number){
        super(message);
        // this.statusCode = statusCode;
        statusCode = statusCode;

        Error.captureStackTrace(this,this.constructor);
    }
}
export default ErrorHandler;