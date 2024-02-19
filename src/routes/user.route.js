import {Router} from "express"
import { userLogIn, userLogout, userRegister } from "../controllers/user.controller.js"
import { upload } from "../middleswares/multer.middlesware.js"
import {verifyjwt} from "../middleswares/auth.middlesware.js"


const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        },
        {
           name:"coverImage",
           maxCount : 1 
        }
    ]),
    userRegister)

    router.route("/login").post(userLogIn)

    router.route("/logout").post(verifyjwt,userLogout)


export default router