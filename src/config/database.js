const mongoose = require('mongoose');

const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://341rajpatel_db_user:Rajpatel123@cluster0.nzegymb.mongodb.net/DevLink");
}

connectDB().then(()=>{
    console.log("Database connection successful..");
}).catch(err=>{
    console.log("Database cannot be connected..");
})

