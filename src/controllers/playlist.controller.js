import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Playlist } from "../models/playlist.model.js"
import { User } from "../models/users.model.js" 
import { Video } from "../models/videos.model.js" 
import mongoose from "mongoose"
import { isValidObjectId } from "mongoose"



const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist

    if(!name || name?.trim() === ""){
        throw new apiError(400,"Name is required")
    }

    if(!description || description?.trim() === ""){
        throw new apiError(400,"Description is required")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner : req.user._id
    })

    if(!playlist){
        throw new apiError(404,"Something went worng while creating the playlist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            201,
            playlist,
            "Playlist created"
        )
    )


})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    const user = await User.findById(userId)

    if(!user){
        throw new apiError(404,"User dees not exist")
    }

    const playlist = await Playlist.aggregate([
        {
            $lookup : {
                from : "users",
                localField : "owner",
                foreignField: "_id",
                as : "Playlists"
            }
        }
    ])

    if(!playlist){
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist,
                "Fetched playlist"
            )
        )
    }

    
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    const playlist = await findById(playlistId)

    if(!playlist){
        throw new apiError(400,"playlist does not exist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            201,
            playlist,
            "Playlist by Id"
        )
    )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    const video = await Video.findById(videoId)

    if(!video){
        throw new apiError(404,"Video does not exist")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new apiError(404,"Playlist does not exist")
    }

    if(playlist.video.includes(videoId)){
        throw new apiError(404,"Video already exist")
    }

    const addvideo = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $push : {
                video : videoId
            }
        },
        {
            new : true
        }
    )

    if(!addvideo){
        throw new apiError(400,"Playlist does not exist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            201,

        )
    )


})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    const video = await Video.findById(videoId)

    if(!video){
        throw new apiError(404,"Video does not exist")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new apiError(404,"Playlist does not exist")
    }

    if(!playlist.video.includes(videoId)){
        throw new apiError(404,"Video not exist playlist")
    }

    const removeVideo = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull : {
                video : videoId
            }
        },
        {
            new : true
        }
    )

    if(!removeVideo){
        throw new apiError(404,"Something went worng while removing the video")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            201,
            removeVideo,
            "Video removed successfully"
        )
    )

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new apiError(404,"Playlist does not exist")
    }

    const deletePlaylist = await Playlist.findByIdAndDelete(playlistId)

    if(!deletePlaylist){
        throw apiError(404,"Something worng while deleting playlist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            201,
            deletePlaylist,
            "Playlist deleted successfully"
        )
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if(!name || name?.trim() === ""){
        throw new apiError(400,"Name is required")
    }

    if(!description || description?.trim() === ""){
        throw new apiError(400,"Description is required")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new apiError(404,"Playlist not exist")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set : {
                name : name,
                description : description
            }
        },
        {
            new : true
        }
    )

    if (!updatePlaylist) {
        throw new apiError(404,"Something went worng while updating the playlist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            201,
            updatePlaylist,
            "Playlist updated successfully"
        )
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}