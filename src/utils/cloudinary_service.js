import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

        
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SCERET 
});


const uploadOnCloudinary  = async function (localFilePath){
    try {
        if(!localFilePath) return null

        // upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type : "auto"
        })

        //file has been uploaded on cloudinary
        //console.log("File : ",response.url)

        fs.unlinkSync(localFilePath) // remove the locally saved temporary file , if files got upload successfully
        return response
        
    } catch (error) {
        fs.unlinkSync(localFilePath)  // remove the locally saved temporary file as the upload operation got failed
        return null 
    }

}

const deleteFromCloudinary = async function (localFilePath){
    try {
        if(!localFilePath){
            console.log("localfile is empty")
            return null
        }
        const respose = await cloudinary.uploader.destroy(localFilePath,{
            resource_type : "auto"
        })

        return respose
        
    } catch (error) {
        return null
    }
}

export { 
    uploadOnCloudinary ,
    deleteFromCloudinary
       }
