import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username : {
        type: String,
        unique : [true, "Username Already taken"]
    },
    email : {
        type : String,
        unique : [true,"Account Already Created with this Email"],
        required : true
    },
    password: {
        type : String,
        required : true,

    }
})

const userModel = mongoose.model("users",UserSchema)  

export default userModel