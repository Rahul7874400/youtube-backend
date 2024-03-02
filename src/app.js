import express from  "express"
import cors from "cors"
import CookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    Credential : true
}))

app.use(express.json({
    limit : "20kb"
}))

app.use(express.urlencoded({
    extended : true,
    limit : "20kb"
}))

app.use(express.static("public"))

app.use(CookieParser())

// router import
import userRouter from "./routes/user.route.js"
import videoRouter from "./routes/video.route.js"
import tweetRouter from "./routes/tweet.route.js"
import commentRouter from "./routes/comment.route.js"
import likeRouter from "./routes/like.router.js"
import subcriptionRouter from "./routes/subscription.router.js"
import playlistRouter from "./routes/playlist.route.js"
import healthCheckRouter from "./routes/healthCheck.route.js"
import dashboardRouter from "./routes/dashboard.route.js"

// declare router

app.use("/api/v1/users",userRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/tweet",tweetRouter)
app.use("/api/v1/comments",commentRouter)
app.use("/api/v1/likes",likeRouter)
app.use("/api/v1/subcription",subcriptionRouter)
app.use("/api/v1/playlist",playlistRouter)
app.use("/api/v1/healthCheck",healthCheckRouter)
app.use("/api/v1/dashboard",dashboardRouter)

// http://localhost:8000/api/v1/users/register

export { app }