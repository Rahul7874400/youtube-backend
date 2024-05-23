import { apiError } from "../utils/ApiError.js"
import  { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary_service.js"
import { Video } from "../models/videos.model.js" 




const publishVideo = asyncHandler( async(req,res) =>{
    // get user input about video
    const {title,description} = req.body

    // validate
    if(title === "" || description === ""){
        throw new apiError(200,"All field are required")
    }

    // upload video and thumbnail to cloudinary

    const videoFilesLocalPath = req.files?.videoFiles[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path

    if(!videoFilesLocalPath){
        throw new apiError(400,"Video File is reaquired")
    }
    if(!thumbnailLocalPath){
        throw new apiError(400,"Thumbnail is required")
    }

    const videoFile = await uploadOnCloudinary(videoFilesLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    if(!videoFile){
        throw new apiError(400,"Something went worng while uploading on cloudinary")
    }
    if(!thumbnail){
        throw new apiError(400,"Something went worng while uploading on cloudinary")
    }

    const video = await Video.create({
        title,
        description,
        videoFiles : videoFile.url,
        thumbnail : thumbnail.url,
        duration : videoFile.duration,
        owner : req.user._id,
        isPublished : true
    })

    await video.save()

    if(!video){
        throw new apiError(404,"Something went worng while publishing the video")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            201,
            video,
            "Video published successfully"
        )
    )

} )

const getVideoById  = asyncHandler( async(req,res)=>{
    const {videoId} = req.params

    const video = await Video.findById(videoId)

    if(!video){
        throw new apiError(404,"Video no longer exist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            201,
            video,
            "Video sucessfully fetched"
        )
    )
} )

const updateVideo = asyncHandler( async(req,res)=>{
    const {description,title} = req.body
    const {videoId} = req.params

    const video = await Video.findById(videoId)

    if(!video){
        throw new apiError(404,"Video no longer exist")
    }

    const preVideoFilesLocalPath = video.videoFiles
    const preThumbnailLocalPath = video.thumbnail

    if(!preVideoFilesLocalPath){
        throw apiError(404,"previous video does not exist")
    }
    if(!preThumbnailLocalPath){
        throw apiError(404,"previous thunbnails does not exist")
    }

    await deleteFromCloudinary(preThumbnailLocalPath)
    await deleteFromCloudinary(preThumbnailLocalPath)

    const currVideoFilesLocalPath = req.files?.videoFiles[0]?.path
    const currThumbnailsLocalPath = req.files?.thumbnail[0]?.path

    const videoFile = await uploadOnCloudinary(currVideoFilesLocalPath)
    const thumbnail = await uploadOnCloudinary(currThumbnailsLocalPath)

    if(!videoFile){
        throw apiError(404,"something went worng while uploading the video")
    }

    if(!thumbnail){
        throw apiError(404,"Something went worng while uploading the thumbnail")
    }

    video.title  = title
    video.description = description
    video.videoFiles = videoFile.url
    video.thumbnail = thumbnail
    video.duration = videoFile.duration

    await video.save({ validateBeforeSave : false })

    return res
    .status(200)
    .json(
        new ApiResponse(201,video,"Video updated succesfully")
    )
} )

const deleteVideo = asyncHandler( async(req,res)=>{

    // get the video id

    const {videoId} = req.params

    // find in db

    const video = await Video.findById(videoId)

    if(!video){
        throw new apiError(404,"Video no longer exist")
    }

    const videoFilesLocalPath = video.videoFiles
    const thumbnailLocalPath = video.thumbnail

    if(!videoFilesLocalPath){
        throw new apiError(404,"video does not exist")
    }

    if(!thumbnailLocalPath){
        throw new apiError(404,"thumbnail does not exist")
    }

     await deleteFromCloudinary(videoFilesLocalPath)
     await deleteFromCloudinary(thumbnailLocalPath)

    const deletedVideo = await Video.findByIdAndDelete(videoId)

    return res
    .status(200)
    .json(
        new ApiResponse(
            201,
            deletedVideo,
            "Video deleted succesfully"
        )
    )
} )

const togglePublishStatus  = asyncHandler( async(req,res)=>{
    const {videoId} = req.params


    const video = await  Video.findById(videoId)

    if(!video){
        throw new apiError(404,"Video no longer exist")
    }

    video.isPublished = !video.isPublished

    video.save({ validateBeforeSave: false })

    return res
    .status(200)
    .json(
        new ApiResponse(201,video,"Video status toggle successfully")
    )
} )

export {
    getAllVideo,
    publishVideo,
    getVideoById ,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}