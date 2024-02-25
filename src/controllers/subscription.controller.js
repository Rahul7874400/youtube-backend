import { apiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import  {ApiResponse } from "../utils/ApiResponse.js"
import { Subscription } from "../models/subscription.model.js"
import { User} from "../models/users.model.js";
import mongoose from "mongoose";


const toggleSubcription = asyncHandler( async(req,res)=>{
    const {channelId} = req.params

    // if(!userId){
    //     throw new apiError(404,"Your are not log in")
    // }

    const user = await  User.findById(channelId)
    if(!user){
        throw new apiError(404,"Channel does not exist")
    }

    const subscriber = await Subscription.findOne({
        channel : channelId,
        subcriber : req.user._id
    })

    if(!subscriber){
        const subscribe = await Subscription.create({
            channel : channelId,
            subcriber : req.user._id
        })

        if(!subscribe){
            throw new apiError(404,"Something went worng while subscribing the channel")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(
                201,
                subscribe,
                "Subscribed channel"
            )
        )
    }
    else{
        const unsubscribe = await Subscription.deleteOne({
            channel : channelId,
            subcriber : req.user._id
        })

        if(!unsubscribe){
            throw new apiError(404,"Something went worng while unsubscribing the channel")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(
                201,
                unsubscribe,
                "Unsubscribed channel"
            )
        )
    }

} )

const getUserChannelSubscribers = asyncHandler( async(req,res)=>{
    // controller to return subscriber list of a channel

    const {channelId} = req.params

    const user = await User.findById(channelId)

    if(!user){
        throw new apiError(404,"Channel no longer exist")
    }
    

    const subscriptions = await Subscription.aggregate([
        {
            $match: {
                subcriber: new mongoose.Types.ObjectId(channelId?.trim())
            }
        },
        {
            $lookup:{
                from: "users",
                localField: "subcriber",
                foreignField: "_id",
                as: "subscribers",
            }
        },
        {
            $project:{
                subscribers:{
                    username: 1,
                    fullName: 1,
                    avatar: 1
                }
            }
        },
    ])

    if(!subscriptions){
        throw new apiError(404,"Something went worng while fetching subscriber")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            201,
            subscriptions[0],
            "Successfully fetched the channel list"
        )
    )

} )

const getSubscribedChannel = asyncHandler( async(req,res)=>{
    // controller to return channel list to which user has subscribed

    const {subscriberId} = req.params

    const user = User.findById(subscriberId)

    if(!user){
        throw new apiError(404,"User does not exist")
    }

    const channelList = Subscription.aggregate([
        {
            $match : {
                channel : new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup : {
                from : "users",
                localField : "subcriber",
                foreignField : "_id",
                as : "channels"
            }
        },
        {
            $project : {
                channel : {
                    fullName : 1,
                    userName : 1,
                    avatar : 1
                }
            }
        }
    ])

    if(!channelList){
        throw new apiError(404,"Something went worng while fetching the channel")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            201,
            channelList,
            "Channle list fetched"
        )
    )
} )

export{
    toggleSubcription,
    getSubscribedChannel,
    getUserChannelSubscribers
}