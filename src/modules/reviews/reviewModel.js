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
        min: [1, 'Lägsta betyg är 1'],
        max: [10, 'Högsta betyg är 10'],
        validate: {
            validator: Number.isInteger,
            message: 'Betyget måste vara ett heltal'
        }
    },
    comment: {
        type: String,
        required: true,
        trim: true,
        maxlength: [5000, 'Kommentaren får vara högst 5000 tecken']
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

reviewSchema.index({movieId: 1, userId: 1}, {unique: true})

const Review = mongoose.model('Review', reviewSchema)
export default Review