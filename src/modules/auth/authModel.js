import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

// Definierar användarschemat
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "E-postadress är obligatorisk"],
      unique: true,
      lowercase: true,
      match: [/.+@.+\..+/, "E-postadressen har ogiltigt format"],
    },
    username: {
      type: String,
      required: [true, "Användarnamn krävs"],
      unique: true,
      minlength: [3, "Användarnamnet måste innehålla minst 3 tecken"],
      maxlength: [20, "Användarnamnet får innehålla högst 20 tecken"],
    },
    password: {
      type: String,
      required: [true, "Lösenord krävs"],
      minlength: [6, "Lösenordet måste vara minst 6 tecken långt"],
      select: false, // Döljer lösenordet vid vanliga sökningar
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

// Hasha lösenordet innan användaren sparas, om det är nytt eller ändrat
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

// Metod för att jämföra lösenord vid inloggning
userSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
