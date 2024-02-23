import { Router } from "express"; 

import { verifyjwt } from "../middleswares/auth.middlesware.js";
import { upload } from "../middleswares/multer.middlesware.js";
import { createTweet,deleteTweet,getUserTweet, updateTweet } from "../controllers/tweet.controller.js";

const router = Router();

router.use(verifyjwt)

router.route("/create").post(createTweet)
router.route("/:userId").get(getUserTweet)
router.route("/update/:tweetId").patch(updateTweet)
router.route("/delete/:tweetId").delete(deleteTweet)





export default router