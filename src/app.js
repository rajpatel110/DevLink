const express = require('express');
const connectDB =require("./config/database");
const app = express();
const User=require("./models/user");
const {validateSignUpData}= require("./utils/validation");
const bcrypt=require("bcrypt");

app.use(express.json());

app.post("/signup",async(req,res)=>{
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

app.post("/login",async(req,res)=>{
    try{
        const{emailId,password}=req.body;
        const user= await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("Invalid credentials..")
        }
        const isPasswordValid=await bcrypt.compare(password,user.password);
        if(isPasswordValid){
            res.send("Login successfull !!");
        }
        else{
            throw new Error("Invalid credentials..");
        }

    }catch(err){
        res.status(400).send("Error: "+err.message);
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
app.patch("/user/:userId",async(req,res)=>{
    const userId=req.params.userId;
    const data=req.body;

    

    try{
        const ALLOWED_UPDATES=["photoUrl","about","age","gender","skills"]

        const isUpdateAllowed =Object.keys(data).every((k)=>
        ALLOWED_UPDATES.includes(k)
        );
        if(!isUpdateAllowed){
            throw new Error("update not allowed..");
        }

        await User.findByIdAndUpdate(userId,data,{runValidators:true,new:true});
        res.send("User updated successfuly");
    }
    catch(err){
        res.status(400).send("UPDATE FAILED:"+ err.message);
    }
})

connectDB()
.then(()=>{
    console.log("Database connection successfull..");
    app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});
}).catch(err=>{
    console.log("Database cannot be connected..");
    console.log(err);
})
