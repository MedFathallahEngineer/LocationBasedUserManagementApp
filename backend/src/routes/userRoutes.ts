import express from "express";
import { User } from "../models/User";
import { ErrorResponse } from "../middleware/errorHandler";
import { Request, Response, NextFunction } from "express";

const router = express.Router();

// Api for creating User
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, latitude, longitude } = req.body;
  
      if (!name || !email || !latitude || !longitude) {
        return next(new ErrorResponse("All fields are required", 400));
      }
      const existingUser = await User.findOne({ email });
      
      if (existingUser) {
        return next(new ErrorResponse("Email already in use", 400));
      }
  
      const user = new User({ name, email, latitude, longitude });
      await user.save();
  
      res.status(201).json({ success: true, data: user });
    } catch (error:any) {
      if (error.code === 11000) {
        return next(new ErrorResponse("Email already in use", 400));
      }
      next(error);
    }
  });

// Api for get all users
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await User.find();
      res.json({ success: true, data: users });
    } catch (error) {
      next(new ErrorResponse("Failed to fetch users", 500));
    }
  });

export default router;
