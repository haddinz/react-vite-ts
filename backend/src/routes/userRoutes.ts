import express, { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { User, UserModel } from "../model/userModel";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken";

export const userRoutes = express.Router();

userRoutes.post(
  "/signin",
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          password: user.password,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).json({ message: "Invalid Password or Email " });
  })
);

userRoutes.post(
  "/register",
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.create({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    } as User);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      token: generateToken(user),
    });
  })
);

userRoutes.put(
  "/profile",
  asyncHandler(async (req: Request, res: Response) => {
    const profile = await UserModel.findOne({ email: req.body.email });
    if (profile) {
      profile.name = req.body.name;
      profile.email = req.body.email;
      profile.password = req.body.password
        ? bcrypt.hashSync(req.body.password)
        : profile.password;

      const updateProfile = await profile.save();
      // res.send({
      //   profile: updateProfile,
      //   message: "Update Profile Successfully",
      // });
      res.json({
        _id: updateProfile._id,
        name: updateProfile.name,
        email: updateProfile.email,
        password: updateProfile.password,
        isAdmin: updateProfile.isAdmin,
        token: generateToken(updateProfile),
      });
      return;
    } else {
      res.status(401).json({ message: "Username Not Found" });
    }
  })
);
