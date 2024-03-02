import { Router } from "express";
import { verifyjwt } from "../middleswares/auth.middlesware.js";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller.js";


const router = Router()

router.use(verifyjwt)

router.route("/status").post(getChannelStats)
router.route("/video").post(getChannelVideos)



export default router