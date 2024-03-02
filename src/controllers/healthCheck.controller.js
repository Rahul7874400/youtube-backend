import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const healthCheck = asyncHandler( async(req,res)=>{
    return res
    .status(200)
    .json(
        new ApiResponse(
            201,
            {},
            "Server is running"
        )
    )
} )

export {
    healthCheck
}