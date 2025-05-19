import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    profilePic: { type: String, required: false, default: "" },
    bio: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.models.Usermodel || mongoose.model("User", UserSchema);

export default User;
