import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"


const connectDB  = async () =>{
    try {
        const connnectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB host at ${connnectionInstance.connection.host}`)
        
    } catch (error) {
        console.log("MongoDB connection error",error)
        // refrence of process on which current application running
        // funtaionality of node js
        process.exit(1)
    }
}

export default connectDB

