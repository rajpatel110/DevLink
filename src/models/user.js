const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
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
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender is not valid");
            }
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

const User=mongoose.model("User",userSchema);
module.exports=User;