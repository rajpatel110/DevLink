const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        index:true,
        minLength:3,
        maxLength:15,
    },
    lastName: {
        type: String
    },
    emailId: {
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    password: {
        type:String,
        required:true,
        minLength:8,
    },
    age: {
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        enum:{
            values:["male","female","other"],
            message: `{value} is not a valid gender type`
        },
    },
    photoUrl:{
        type:String,
    },
    about:{
        type:String,
        default:"This is default description of User",
    },
    Skills:{
        type:[String],
    }
},{timestamps:true,});

//compound indexing
userSchema.index({firstName: 1, lastName: 1});

userSchema.methods.getJWT = async function(){
    const user=this;

    const token = await jwt.sign({_id:user._id},"DEV@Link$79",{expiresIn:"7d"});
    return token;
};

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user=this;
    const passwordHash=user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHash);
    return isPasswordValid;
};

const User=mongoose.model("User",userSchema);
module.exports=User;