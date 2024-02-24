import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Comment } from "../models/comment.model.js"
import { User } from "../models/users.model.js" 
import { Video } from "../models/videos.model.js" 
import mongoose from "mongoose"
import { isValidObjectId } from "mongoose"


const getVideoComment = asyncHandler( async(req,res)=>{
    const {videoId} = req.params

    const {page = 1,limit = 10} = req.query

    const video = await Video.findById(videoId)

    if(!video){
        throw new apiError(404,"Video does not exist")
    }

    const commentOnVideo = await Comment.aggregate([
        {
            $match : {
                owner : new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $project : {
                content : 1,
                video : 1,
                owner : 1,
                createdAt : 1,
                updatedAt : 1
            }
        }
    ])

    const result = await Comment.aggregatePaginate(
        commentOnVideo,
        {
            page,
            limit
        }
    )

    if(!result){
        throw apiError(404,"Something went wrong while getting comment api")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            result.docs,
            "Comment fetched successfully"
        )
    )

} )

const addComment = asyncHandler( async(req,res)=>{
    const { content } = req.body;
    const { videoId } = req.params
    //console.log(req.body,req.params)
    if(!content || content?.trim() === ""){
        throw new apiError(404,"Please write something for comment")
    }
   
    if(!isValidObjectId(videoId)){
        throw new apiError(404,"Worng video id")
    }
    const video = await Video.findById(videoId)

    if(!video){
        throw new apiError(404,"Video no longer exist")
    }


    const comment = await Comment.create({
        content : content,
        owner : req.user._id,
        video : videoId
    })

    if(!comment){
        throw new apiError(404,"something went worng while adding the comment")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            201,
            comment,
            "Comment added successfully"
        )
    )

} )

const updateComment = asyncHandler(async(req,res)=>{
    const {commentId} = req.params
    const {content} = req.body

    if(!content || content?.trim() === ""){
        throw new apiError(404,"Please write something for comment")
    }
    const comment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set : {
                content : content
            }
        },
        {
            new : true
        }
    )

    if(!comment){
        throw new apiError(404,"Comment no more exist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            201,
            comment,
            "Comment updated successfully"
        )
    )

})

const deleteComment = asyncHandler(async(req,res)=>{
    const {commentId} = req.params

    const comment = await Comment.findByIdAndDelete(commentId)

    if(!comment){
        throw new apiError(404,"Comment no more exist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            201,
            comment,
            "Comment deleted successfully"
        )
    )

})

export{
    getVideoComment,
    addComment,
    updateComment,
    deleteComment
}