import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/users.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Video } from "../models/videos.model.js";
import mongoose from "mongoose";


const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    const { userId } = req.user?._id

    const user = await User.findById(userId)
    if(!user){
        new apiError(404,"User no longer exist")
    }
    // TODO : total likes

    // tatal subscribers

    const subscribers = await Subscription.aggregate([
        {
            $match : {
                channel : new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $count : "subscribers"
        }
       
    ])

    // total video

    const video = await  Video.aggregate([
        {
            $match : {
                owner : new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $count : "videos"
        }
       
    ])
    // TODO : total video view

    if(!subscribers || !video){
        new apiError(404,"Something went worng while fetching the status")
    }

    const sta = {
        Subscribers : subscribers,
        video : video
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            201,
            sta,
            "Status of channels"
        )
    )


})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    const {userId} = req.user?._id

    const user = await User.findById(userId)

    if(!user){
        new apiError(404,"Channel does not exist")
    }

    const allVideo = await Video.aggregate([
        {
            $match : {
                owner : new mongoose.Types.ObjectId(req.user?._id)
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            201,
            allVideo,
            "Fetch all video"
        )
    )
})

export {
    getChannelStats,
    getChannelVideos
}