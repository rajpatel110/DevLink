const express =require("express");
const userRouter = express.Router();
const {userAuth}=require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

//pending connection req for logged in user
userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", "firstName lastName photoUrl age gender about skills");

        res.json({message:"Data fetched successfuly",data:connectionRequests});

    }catch(err){
        res.status(400).send("Error: " + err.message);
    }
})

userRouter.get("/user/connections",userAuth,async(req,res) =>{
    try{
        const loggedInUser = req.user;

        //to see all connections we need to see if a received req or a send req ,  connection req status should be accepted
        const connectionRequests = await ConnectionRequest.find({
            $or:[
                { toUserId: loggedInUser._id, status: "accepted"},
                { fromUserId: loggedInUser._id , status: "accepted"},
            ],
        }).populate("fromUserId", "firstName lastName photoUrl age gender about skills")
        .populate("toUserId", "firstName lastName photoUrl age gender about skills");

        //to get only essencial data
        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id.equals(loggedInUser._id)) {
                return row.toUserId;      // I sent the request, so return the receiver
            } else {
                return row.fromUserId;    // They sent the request, so return the sender
            }
});
        res.send({data});

    }catch(err){
        res.status(400).send({message: err.message});
    }
})

module.exports = userRouter;