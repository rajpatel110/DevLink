const express = require('express');
const connectDB =require("./config/database");

const app = express();
const User=require("./models/user");

app.post("/signup",async(req,res)=>{
    const user=new User({
        firstName:"Raj",
        lastName:"Patel",
        emailId:"Rajpatel@123.com",
        password:"raj@123",
    });
    try{
        await user.save();
        res.send("User added successfuly");
    }catch(err){
        res.status(400).send("error sving the user"+err.message);
    }
});

connectDB()
.then(()=>{
    console.log("Database connection successful..");
    app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});
}).catch(err=>{
    console.log("Database cannot be connected..");
})




