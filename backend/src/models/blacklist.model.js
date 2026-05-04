import mongoose from "mongoose";

const BlacklistSchema = new mongoose.Schema({
    token : {
        type : String,
        required : true
    }
})

const blacklistModel = mongoose.model("blacklist",BlacklistSchema)

export default blacklistModel