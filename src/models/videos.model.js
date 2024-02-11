import mongoose  from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema({
    videoFiles : {
        type : String,// cloudinary url
        required : true
    },
    thumbnail : {
        type : String, // cloudinary url
        require : true
    },
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    duration : {
        type : Number, //cloudinary url
        required : true
    },
    views : {
        type : Number,
        default  : 0
    },
    isPublished : {
        type : Boolean,
        default : true
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }

},{timestamps : true})


// plugin for to use aggregate function
videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video",videoSchema)