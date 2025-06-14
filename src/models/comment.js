const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId, //agregue 
      ref: "Post",
      required: [true, "PostId es requerido"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "UserId es requerido"],
    },
    text: {
      type: String,
      required: [true, "Text es requerido"],
      validate: {
        validator: (t) => t.trim().length > 0,
        message: (props) => `El texto no puede estar vacío`,
      },
    },

    visible: { 
      type: Boolean,
      default: true
    },
    
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "comments",
  }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment ;
