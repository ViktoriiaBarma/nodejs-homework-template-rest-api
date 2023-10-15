const { Schema, model } = require("mongoose");


const subscriptions = ["starter", "pro", "business"];

const userSchema = new Schema(
  {
     password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: subscriptions,
      default: "starter",
    },
     token: {
      type: String,
      default: null,
    },
     avatarURL: {
      type: String,
      require: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const User = model("user", userSchema);


module.exports = User;

