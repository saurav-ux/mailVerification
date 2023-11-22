import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Number,
    required: true,
  },
  isVerified: {
    type: Number,
    default: 0,
  },
});

const UserData = new mongoose.model("UserData", userSchema);
export default UserData;
