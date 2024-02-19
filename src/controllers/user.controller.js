import {apiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {User} from "../models/users.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary_service.js"
import jwt from "jsonwebtoken"

const generateAccessTokenAndRefreshToken = async (userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new apiError(500, error.message || "Something went wrong while generating referesh and access token")
    }

}


const userRegister = asyncHandler ( async function (req,res) {

    //get details
    const {userName,email,password,fullName} = req.body

    // validate

    if ([userName,email,password,fullName].some ((feild) => feild?.trim() == "")) {
        
        throw new apiError(400,"All feild are required");
    }

    //check for exsited user

    const existedUser = await User.findOne({
        $or : [{email},{userName}]
    })

    if(existedUser){
        throw new apiError(400,"User with username and email is already exist")
    }

    // upload to cloudinary

    const avatarLocalPath = req.files?.avatar[0]?.path

    let coverImageLocalPath

    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new apiError(200,"Avatar file is require")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new apiError(400,"avatar files is require")
    }

    // create user and insert in db

    const user = await User.create({
        fullName,
        userName : userName,
        email,
        password,
        avatar : avatar.url,
        coverImage : coverImage?.url || ""

    })

    await user.save();
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new apiError(200,"Something went worng while registering the user")
    }

    // return res

    return res.status(200).json(
        new ApiResponse(202,createdUser,"Succesfully registered")
    )

}  )

const userLogIn = asyncHandler( async (req,res)=>{
    // get user data
    //find user with username or email
    // check password
    // generate Access token and Refresh token
    // send cookie

    // get data
    const {email,userName,password} = req.body

    if(!(userName || email)){
        throw new apiError(404,"username or email is required")
    }

    // find user
    const user = await User.findOne({
        $or : [{email},{userName}]
    })

    if(!user){
        throw new apiError(400,"User doest not exist")
    }

    // password check
    const isPassword = await user.isPasswordCorrect(password)
    if (!isPassword) {
        throw new apiError(404,"Password is incorrect")
    }

    // generate Token

    const {accessToken ,refreshToken} = await generateAccessTokenAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // send cookie
    // bydefault cookie can be modifiable from frontend
    // after this cookies can be modify only on server
    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

} )

const userLogout = asyncHandler ( async (req,res) =>{
    User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                refreshToken : undefined /// remove this field from db
            }
        },
        {
            new : true
        }
    )

    const options  = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(404,{},"user logged out"))
} )

const refreshAccessToken  = asyncHandler( async(req,res)=>{
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken

    if (!incomingRefreshToken) {
        throw new apiError(404,"Unauthorized user")
    }

   try {
     const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
 
     const user = await User.findById(decodedToken._id)
 
     if(!user){
         throw new apiError(404,"Invalid user")
     }
 
     if(incomingRefreshToken !== user?.refreshToken){
         throw new apiError(400,"Refresh token is expired")
     }
 
     const {accessToken,newRefreshToken} = await generateAccessTokenAndRefreshToken(decodedToken._id)
 
     const options = {
         httpOnly:true,
         secure: true
     }
 
     return res
     .status(200)
     .cookie("accessToken", accessToken, options)
     .cookie("refreshToken", newRefreshToken, options)
     .json(
         new ApiResponse(
             200, 
             {
                 accessToken,
                 refreshToken : newRefreshToken
             },
             "Access token refreshed"
         )
     )
   } catch (error) {
    throw new apiError(404,error?.message,"Invalid refresh token")
   }

} )

export { userRegister, 
         userLogIn,
         userLogout,
         refreshAccessToken
        }