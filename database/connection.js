import mongoose from "mongoose";
// const connect ='mongodb://127.0.0.1:27017/mailData'
import dotenv from "dotenv";
dotenv.config();
const connect = process.env.CONNECTION
mongoose.connect(connect,{

}).then(()=>{
    console.log("Connected to MongoDb")
}).catch((error)=>{
    console.log("Connection Failed: ",error)
})
