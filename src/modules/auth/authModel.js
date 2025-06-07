import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email måste anges"],
      unique: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Ogiltigt email-format"],
    },
    username: {
      type: String,
      required: [true, "Användarnamn måste anges"],
      unique: true,
      minlength: [3, "Användarnamnet måste vara minst 3 tecken"],
      maxlength: [20, "Användarnamnet får vara max 20 tecken"],
    },
    password: {
      type: String,
      required: [true, "Lösenord måste anges"],
      minlength: [6, "Lösenordet måste vara minst 6 tecken"],
      select: false,
    },
     role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;