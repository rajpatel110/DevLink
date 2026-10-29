const mongoose = require("mongoose");
let connectionPromise;
const connectDB = async () => {
    if (!connectionPromise) {
        connectionPromise = mongoose.connect(process.env.DB_CONNECTION_SECRET)
            .catch((error) => { connectionPromise = undefined; throw error; });
    }
    return connectionPromise;
};
module.exports = connectDB;
