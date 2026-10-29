require("dotenv").config();

const express = require('express');
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}
));
app.use(express.json());
app.use(cookieParser());
app.use(async (req, res, next) => {
    try { await connectDB(); next(); }
    catch { res.status(503).json({ message: "Database unavailable. Please try again." }); }
});

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/chat", chatRouter);
if (require.main === module) connectDB()
    .then(() => {
        console.log("Database connection successfull..");
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server is running on port ${process.env.PORT || 3000}`);
        });
    }).catch(err => {
        console.log("Database cannot be connected..");
        console.log(err);
    })

module.exports = app;
