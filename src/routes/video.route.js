import { Router } from "express";
import { deleteVideo, getVideoById, publishVideo, togglePublishStatus, updateVideo, } from "../controllers/video.controller.js";
import { upload } from "../middleswares/multer.middlesware.js"; 
import { verifyjwt } from "../middleswares/auth.middlesware.js"; 



const router = Router();
router.use(verifyjwt); // Apply verifyJWT middleware to all routes in this file

router.route("/publish").post(
    upload.fields([
        {
            name : "videoFiles",
            maxCount : 1
        },
        {
            name : "thumbnail",
            maxCount : 1
        }
    ]),
    publishVideo
)

router.route("/c/:videoId")
.get(getVideoById)
.patch(
    upload.fields([
        {
            name : "videoFiles",
            maxCount : 1
        },
        {
            name : "thumbnail",
            maxCount : 1
        }
    ]),
    updateVideo)
.delete(deleteVideo)

router.route("/publish/toggle/:videoId")
.post(togglePublishStatus)





export default router