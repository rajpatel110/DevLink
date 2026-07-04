const express = require('express');
const connectDB =require("./config/database");

const app = express();
const User=require("./models/user");

app.use(express.json());

app.post("/signup",async(req,res)=>{
    const user=new User(req.body);
    try{
        await user.save();
        res.send("User added successfuly");
    }catch(err){
        res.status(400).send("error saving the user"+err.message);
    }
});

//get user by email
app.get("/user",async(req,res)=>{
    const userEmail=req.body.emailId;
    try{
        const user=await User.find({emailId:userEmail});
        if(user.length===0){
            res.status(400).send("user not found");
        }
        else{
            res.send(user);
        }
    }
    catch(err){
        res.status(400).send("something went wrong");
    }
})

///feed api get all users from database
app.get("/feed",async(req,res)=>{
    try{
        const users=await User.find({});
        res.send(users);
    }
    catch(err){
        res.status(400).send("something went wrong..")
    }
})

//delete a user from database
app.delete("/user",async(req,res)=>{
    const userId=req.body.userId;
    try{
        const user=await User.findByIdAndDelete(userId);
        res.send("User deleted successfully..");
    }
    catch(err){
        res.status(400).send("something went wrong..")
    }
})

//update data of a user
app.patch("/user",async(req,res)=>{
    const userId=req.body.userId;
    const data=req.body;
    try{
        await User.findByIdAndUpdate(userId,data);
        res.send("User updated successfuly");
    }
    catch(err){
        res.status(400).send("something went wrong");
    }
})

connectDB()
.then(()=>{
    console.log("Database connection successfully..");
    app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});
}).catch(err=>{
    console.log("Database cannot be connected..");
})




