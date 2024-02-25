import { Router } from "express";
import { verifyjwt } from "../middleswares/auth.middlesware.js";
import { getSubscribedChannel, getUserChannelSubscribers, toggleSubcription } from "../controllers/subscription.controller.js";

const router = Router()

router.route("/:channelId").post(
    verifyjwt,
    toggleSubcription)
router.route("/subscriber/:channelId").post(getUserChannelSubscribers)

router.route("/channels/:channelId").post(getSubscribedChannel)





export default router