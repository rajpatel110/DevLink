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

//compound indexing 
connectionRequestSchema.index({fromUserId: 1 , toUserId: 1});

connectionRequestSchema.pre("save",function(){
    const connectionRequest = this;
    //check if from userid same as to userid
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection req to yourself! ");
    }
    next();
})

const ConnectionRequest = new mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports=ConnectionRequest;