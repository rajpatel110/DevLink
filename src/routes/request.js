const express = require("express");
const requestRouter = express.Router();
const {userAuth}=require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User= require("../models/user");


requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId =req.params.toUserId;
        const status=req.params.status;

        //only you can ignore or interested you cant accept your connection req from your side
        const allowedStatus = ["ignore","interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Invalid status type : "+ status})
        }

        //you cant send yourself connection req
        //can handle using if also can handle by pre in schema

        //can send req to only existing users 
        const toUser = await User.findById(toUserId);        if(!toUser){
            return res.status(404).json({message: "User not found "});
        }

        //if existing connection req is there user should not send it again and 2nd person also cant send connection req  
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId , toUserId},
            {fromUserId:toUserId, toUserId:fromUserId},]
        });

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });
        if(existingConnectionRequest){
            return res.status(400).send({message: "Connection request already exists! "});
        }


        const data = await connectionRequest.save();
        res.json({
            message: "Connection request sent successfully",
            data,
        })

    }catch(err){
        res.status(400).send("Error: " + err.message);
    }

})

module.exports = requestRouter;