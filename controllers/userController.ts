require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { ejs } from "ejs";
import userModel from "../models/user.models";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import path from "path";

//  user register
interface IRegistreationBody {
  name: string;
  email: string;
  password: string;
  avater?: string;
}
export const registerationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("user exist already", 400));
      }
      const user: IRegistreationBody = {
        name,
        email,
        password,
      };
      const activationToken = createActivationToken(user);

      const activationCode = activationToken.activationCode;

      const data = { user: { name: user.name }, activationCode };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/action-mail.ejs"),
        data
      );
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IActivationToken {
  token: string;
  activationCode: string;
}
export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.JWT_ACTIVATION_SECRET_TOKEN as Secret,
    {
      expiresIn: "5m",
    }
  );
  return { token, activationCode };
};
