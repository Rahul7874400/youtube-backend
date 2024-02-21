import {Router} from "express"
import { 
    changeCurrentPassword, 
    getCurrentUser, 
    getUsercChannelProfile, 
    refreshAccessToken , 
    updateAccountDetail,
     updateAvatar, 
     updateCoverImage, 
     userLogIn, 
     userLogout, 
     userRegister, 
     watchHistory
    } from "../controllers/user.controller.js"
import { upload } from "../middleswares/multer.middlesware.js"
import {verifyjwt} from "../middleswares/auth.middlesware.js"


const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name : "avatar", // frontend feild must be avatar
            maxCount : 1
        },
        {
           name:"coverImage",  // frontend feild must be coverImage
           maxCount : 1 
        }
    ]),
    userRegister)

    router.route("/login").post(userLogIn)

    // secure
    router.route("/logout").post(verifyjwt,userLogout)
    router.route("/refresh-token").post(refreshAccessToken )
    router.route("/change-password").post(verifyjwt,changeCurrentPassword)
    router.route("/current-user").post(verifyjwt,getCurrentUser)
    router.route("/update-account").patch(verifyjwt,updateAccountDetail)
    router.route("/update-avatar").patch(verifyjwt,upload.single("avatar"),updateAvatar)
    router.route("/update-coverImage").patch(verifyjwt,upload.single("coverImage"),updateCoverImage)
    router.route("/c/:userName").get(verifyjwt,getUsercChannelProfile)
    router.route("/watch-history").get(verifyjwt,watchHistory)
    


export default router