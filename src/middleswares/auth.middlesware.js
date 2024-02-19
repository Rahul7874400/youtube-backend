import { User } from "../models/users.model.js";
import { apiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"


export const verifyjwt = asyncHandler( async (req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if(!token){
            throw new apiError(404,"Unauthorized user")
        }

        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SCERET)
        const user = await User.findById(decoded?._id).select(
            "-password -rerefreshToken"
        )

        if(!user){
            throw new apiError(404,"Invalid User")
        }

        req.user = user
        next()
        
    } catch (error) {
        throw new apiError(404,"Invalid Token")
    }
} )