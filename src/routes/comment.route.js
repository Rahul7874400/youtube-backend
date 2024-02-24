import { Router } from "express"; 
import { verifyjwt } from "../middleswares/auth.middlesware.js"
import { addComment,updateComment, deleteComment, getVideoComment } from "../controllers/comment.controller.js";

const router = Router()

router.use(verifyjwt)

router.route("/:videoId").post(addComment).get(getVideoComment)
router.route("/update/:commentId").patch(updateComment)
router.route("/delete/:commentId").delete(deleteComment)


export default router