const express = require("express");
const requestRouter = express.Router();
const {userAuth}=require("../middlewares/auth");


requestRouter.post("/request/send/interested/:toUserId",userAuth,async(req,res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId =req.params.toUserId;
        const status=req.params.toUserId;

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

    }catch(err){
        res.status(400).send("Error: " + err.message);
    }

    res.send(user.firstName +"sent the connection request");

})

module.exports = requestRouter;