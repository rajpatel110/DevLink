const express = require("express");
const authRouter = express.Router();
const {validateSignUpData}= require("../utils/validation");
const User=require("../models/user");
const bcrypt=require("bcrypt");



authRouter.post("/signup",async(req,res)=>{
    //validation
    try{
    validateSignUpData(req);

    const{firstName,lastName,emailId,password}=req.body;

    //encrypt psw
    const passwordHash=await bcrypt.hash(password,10)

    const user=new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
    }
    );
    
        await user.save();
        res.send("User added successfuly");
    }catch(err){
        res.status(400).send("error saving the user. "+err.message);
    }
});


authRouter.post("/login",async(req,res)=>{
    try{
        const{emailId,password}=req.body;
        const user= await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("Invalid credentials..")
        }
        const isPasswordValid=await user.validatePassword(password);
        if(isPasswordValid){

            //create jwt token 
            const token=await user.getJWT();

            // add token to cookie and send res back to user
            res.cookie("token",token,{expires:new Date(Date.now()+8*(600000))});
            res.send("Login successful!!");

        }
        else{
            throw new Error("Invalid credentials..");
        }

    }catch(err){
        res.status(400).send("Error: "+err.message);
    }
});

module.exports = authRouter;