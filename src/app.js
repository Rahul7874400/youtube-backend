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

// declare router

app.use("/api/v1/users",userRouter)

// http://localhost:8000/api/v1/users/register

export { app }