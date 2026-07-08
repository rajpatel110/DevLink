const mongoose = require('mongoose');

const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://341rajpatel_db_user:Guruharrai@cluster0.nzegymb.mongodb.net/DevLink");
}

module.exports = connectDB;

