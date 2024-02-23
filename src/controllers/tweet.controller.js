import { asyncHandler } from "../utils/asyncHandler.js"; 
import { apiError } from "../utils/ApiError.js"; 
import { ApiResponse } from "../utils/ApiResponse.js"; 

import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/users.model.js"; 



const createTweet = asyncHandler( async(req,res)=>{
    // get user input
    const {content} = req.body

    // validate tweet
    if(!content || content?.trim()===""){
        throw new apiError(400, "content is required")
    }

    // find user in db
    const user = User.findById(req.user._id)

    if(!user){
        throw new apiError(404,"user does not exist")
    }

    const createdTweet = await Tweet.create({
        content : content,
        owner : req.user._id
    })

    await createdTweet.save();

    if(!createTweet){
        throw new apiError(404, "Something went worng while creating tweet")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            201,
            createdTweet,
            "Tweet created successfully"
        )
    )


} )

const getUserTweet = asyncHandler( async(req,res)=>{
    const {userId} = req.params

    const user =  await User.findById(userId)

    if(!user){
        throw apiError(404,"User does not exist")
    }

    const tweet = await Tweet.aggregate([
        {
            $match : {
                owner : user._id
            }
        },
        {
            $project : {
                content : 1
            }
        }
    ])



    return res
    .status(200)
    .json(
        new ApiResponse(
            201,
            tweet,
            "Fetched all tweet"
        )
    )
} )

const updateTweet = asyncHandler( async(req,res)=>{
    const { content } = req.body
    if(!content || content?.trim() === ""){
        throw new apiError(404,"Please write something to tweet")
    }
    const { tweetId } = req.params

    const tweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set : {
                content : content
            }
        },
        {
            new : true
        }
    )

    if(!tweet){
        throw new apiError(404,"Tweet no longer exist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            201,
            tweet,
            "Tweet updated sucessfully"
        )
    )
} )

const deleteTweet = asyncHandler( async(req,res)=>{
    const {tweetId} = req.params

    const tweet = await Tweet.findByIdAndDelete(tweetId)

    if(!tweet){
        throw new apiError(404,"Tweet does not exist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            201,
            tweet,
            "Tweet deleted"
        )
    )

} )

export {
    createTweet,
    getUserTweet,
    updateTweet,
    deleteTweet
}