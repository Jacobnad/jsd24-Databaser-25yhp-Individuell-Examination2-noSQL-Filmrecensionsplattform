import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    movieId: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: [1, "Minsta tillåtna betyg är 1"],
      max: [10, "Maximalt tillåtna betyg är 10"],
      validate: {
        validator: Number.isInteger,
        message: "Betyget måste anges som ett helt tal",
      },
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: [5000, "Kommentarens längd får inte överskrida 5000 tecken"],
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

// Säkerställer att samma användare inte recenserar samma film mer än en gång
reviewSchema.index({ movieId: 1, userId: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
