import { asyncHandler } from "../utils/asyncHandler.js"; 
import { apiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"; 
import { Like }  from "../models/like.model.js"
import { Video } from "../models/videos.model.js"; 
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";

const toggleVideoLike = asyncHandler( async(req,res)=>{
    const {videoId} = req.params
    const { userId } = req.user._id

    const video = await Video.findById(videoId)
    
    if(!video){
        throw new apiError(404,"Video no longer exist")
    }

    const alreadyLikedOrNot = await Like.findOne(
        {
            video : videoId
        }
    )
    let like
    let unlike

    if(!alreadyLikedOrNot){
        like = await Like.create({
            video : videoId,
            likedBy : userId
        })

        if(!like){
            throw new apiError(404,"something went worng while liking the video")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(
                201,
                like,
                "Video liked"
            )
        )
    }

    else{
        unlike = await Like.deleteOne({
            video : videoId
        })

        if(!unlike){
            throw new apiError(404,"something went worng while unlinking the video")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(
                201,
                unlike,
                "Video unliked"
            )
        )
    }
} )

const toggleCommentLike = asyncHandler( async(req,res)=>{
    const {commentId} = req.params
    const {userId} = req.user._id

    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new apiError(404,"Comment no longer exist")
    }

    const alreadyLikeOrNot = await Like.findOne({
        comment : commentId
    })

    let like
    let unlike

    if(!alreadyLikeOrNot){
        const like = await Like.create({
            comment : commentId,
            likedBy : userId
        })

        if (!like) {
            throw new apiError(404,"Something went worng while liking the comment")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(
                201,
                like,
                "Liked comment"
            )
        )
    }

    else{
        const unlike = await Like.deleteOne({
            comment : commentId
        })

        if (!unlike) {
            throw new apiError(404,"Something went worng while unliking the comment")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(
                201,
                unlike,
                "unliked comment"
            )
        )
    }
} )

const toggleTweetLike = asyncHandler( async(req,res)=>{
    const {tweetId} = req.params
    const {userId} = req.user?._id

    const tweet = await Tweet.findById(tweetId)

    if(!tweet){
        throw new apiError(404 , "Tweet no longer exist")
    }

    const alreadyLikedOrNot = await Like.findOne({
        tweet : tweetId
    })

    let like
    let unlike

    if(!alreadyLikedOrNot){
        const like = await Like.create({
            tweet : tweetId,
            likedBy : userId
        })

        if(!like){
            new apiError(404,"Something worng while liking the tweet")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(
                201,
                like,
                "Liked tweet"
            )
        )
    }

    else{
        const unlike = await Like.deleteOne({
            tweet : tweetId
        })

        if(!unlike){
            new apiError(404,"Something worng while unliking the tweet")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(
                201,
                unlike,
                "unliked tweet"
            )
        ) 
    }
} )

const getLikedVideo = asyncHandler( async(req,res)=>{
    
} )

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideo
}