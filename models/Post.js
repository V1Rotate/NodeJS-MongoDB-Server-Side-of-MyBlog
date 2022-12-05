import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      unique: true,
    },
    tags: {
      type: Array,
      default: [], //this is an option to keep tags not reqiiore but optional
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', //relation to the Users schema.Required
      required: true,
    },
    imageUrl: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Post', PostSchema); //ready to go exported schema
