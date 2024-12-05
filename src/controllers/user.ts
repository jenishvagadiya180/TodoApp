import { userModel } from "../models/index";
import { services, statusCode } from "../helper";
import bcrypt from "bcrypt";
import { RequestError, BadRequestError } from "../error/error";
import { Request, Response, NextFunction } from "express";

const saltRounds = 10;

const send = services.setResponse;

class User {
  static addUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (services.hasValidatorErrors(req, res)) {
        return;
      }

      const matchEmail = await userModel.findOne({ username: req.body.username });
      if (matchEmail) {
        return send(
          res,
          statusCode.BAD_REQUEST,
          "User Already Exists",
          null
        );
      }

      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

      const user = new userModel({
        username: req.body.username,
        password: hashedPassword,
      });
      const userData = await user.save();

      return send(
        res,
        statusCode.SUCCESSFUL,
        "Successfully registered",
        { userId: userData._id }
      );
    } catch (error) {
      next(error);
    }
  };

  static userLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (services.hasValidatorErrors(req, res)) {
        return;
      }

      const userData = await userModel.findOne({
        username: req.body.username,
        isDeleted: false,
      });
      if (!userData) throw new BadRequestError("Invalid username");

      const isPasswordValid = await bcrypt.compare(req.body.password, userData.password);
      if (!isPasswordValid) throw new BadRequestError("Invalid password");

      const token = await services.userTokenGenerate(
        { username: req.body.username, _id: userData._id },
        process.env.EXPIRE_TIME!
      );

      const userObj = {
        userName: userData.username,
        id: userData._id,
        token: token,
      };

      return send(res, statusCode.SUCCESSFUL, "Login Successful", userObj);
    } catch (error) {
      next(error);
    }
  };
}

export default User;
