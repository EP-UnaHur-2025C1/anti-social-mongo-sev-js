const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId es requerido"],
    },
    description: {
      type: String,
      required: [true, "La descripción es requerida"],
      validate: {
        validator: (t) => t.trim().length > 0,
        message: () => "El post debe contener una descripción",
      },
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "posts",
  }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
