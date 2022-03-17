const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
    },
    password: String,

    goals:[{ type: Schema.Types.ObjectId, ref: 'Goal' }],

    imageUrl: String
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
