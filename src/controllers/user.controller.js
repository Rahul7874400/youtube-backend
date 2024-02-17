import {apiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {User} from "../models/users.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary_service.js"


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

export { userRegister }