const mongoose = require ("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type:mongoose.Schema.Types.ObjectId,
        required :true
    },
    toUserId: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    status: {
        type:String,
        required:true,
        enum:{
            values:["ignore","interested","accepted","rejected"],
            message: `{value} is not supported`
        }
    }
},{timestamps:true});

const ConnectionRequestModel = new mongoose.model("ConnectionRequesModel",connectionRequestSchema);

module.exports=ConnectionRequest;