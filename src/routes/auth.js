const express = require("express");
const authRouter = express.Router();
const {validateSignUpData}= require("../utils/validation");
const User=require("../models/user");
const bcrypt=require("bcrypt");
const validator = require("validator");
const crypto = require("crypto");



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
        res.send("User added successfully");
    }catch(err){
        res.status(400).send("error saving the user. "+err.message);
    }
});


authRouter.post("/login",async(req,res)=>{
    try{
        const{emailId,password}=req.body;

        const user= await User.findOne({emailId:emailId}).select("+password");
        if(!user){
            throw new Error("Invalid credentials..")
        }
        const isPasswordValid=await user.validatePassword(password);
        if(isPasswordValid){

            const token=await user.getJWT();

            res.cookie("token",token,{expires:new Date(Date.now()+7*24*60*60*1000)});

            const userObj = user.toObject();
            delete userObj.password;
            res.send(userObj);

        }
        else{
            throw new Error("Invalid credentials..");
        }

    }catch(err){
        res.status(400).send("Error: "+err.message);
    }
});

authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{expires: new Date(Date.now()),});
    res.send("Logout successfull !");
})


authRouter.post("/forgotPassword", async (req, res) => {
    try {
        const { emailId } = req.body;
        const user = await User.findOne({ emailId });

        if (!user) {
            return res.status(404).send("No account found with that email.");
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save({ validateBeforeSave: false });

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        // No email service wired up yet — log it server-side and
        // hand it back to the frontend directly so it can be shown/tested.
        console.log("Password reset link:", resetUrl);

        res.json({
            message: "Reset link generated.",
            resetUrl,
        });

    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});


authRouter.post("/resetPassword/:token", async (req, res) => {
    try {
        const { password } = req.body;
        const { token } = req.params;

        if (!validator.isStrongPassword(password)) {
            throw new Error("please enter a strong password!");
        }

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        }).select("+resetPasswordToken +resetPasswordExpires");

        if (!user) {
            return res.status(400).send("Reset link is invalid or has expired.");
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.send("Password reset successfully. Please log in.");

    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});


module.exports = authRouter;