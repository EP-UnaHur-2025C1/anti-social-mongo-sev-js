const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "userName es requerido"],
      unique: [true, "ya existe ese userName"],
    },

    email: {
      type: String,
      required: [true, "email es requerido"],
      validate: {
        validator: (t) => validator.isEmail(t),
        message: (props) => `${props.value} no es un email válido`,
      },
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

// Campo virtual para poblar los follower de este usuario
userSchema.virtual('followers', {
  ref: 'Follow',
  localField: '_id',
  foreignField: 'users'
})
// Campo virtual para poblar los followed de este usuario
userSchema.virtual('followed', {
  ref: 'Follow',
  localField: '_id',
  foreignField: 'users'
})

// Hacer que los virtuales se incluyan al convertir en JSON o en objeto
userSchema.set('toJSON', { virtuals: true })
userSchema.set('toObject', { virtuals: true })

const User = mongoose.model("User", userSchema);
module.exports = User ;