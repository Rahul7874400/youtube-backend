import mongoose from "mongoose";
import Jwt  from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({

    userName : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        index : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        index : true
    },
    fullName : {
        type : String,
        required : true,
        index : true,
        trim : true
    },
    avatar : {
        type : String, // cloudinary url
        required : true
    },
    coverImage : {
        type : String //cloudinary url
    },
    watchHistory : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Video"
        }
    ],
    password : {
        type : String,
        required : true
    },
    refreshToken : {
        type : String
    }

},{timestamps : true})


// encrypt the password field

userSchema.pre("save",async function (next) { 
    if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password,10)
    return next()
})

// check password is correctly encrypted or not
// inject the customized function to schema

userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password,this.password)
}

// generate token
userSchema.methods.generateAccessToken = function () {
    return Jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SCERET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE
        }
    )
}

// generate refresh token

userSchema.method.generateRefreshToken = function () {
    return Jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRE
        }

    )
}


export const User = mongoose.model("User",userSchema)