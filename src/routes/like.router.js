import { Router } from "express";
import { verifyjwt } from "../middleswares/auth.middlesware.js";
import { toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js"; 


const router = Router()

router.use(verifyjwt)

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike)
router.route("/toggle/t/:tweetId").post(toggleTweetLike)







export default router