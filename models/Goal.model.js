const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const goalSchema = new Schema(
  {
    name: String,

    description: String,
    
    type: String,

    frequency: Number,

    streak: Number,
  }
     
);

const Goal = model("Goal", goalSchema);

module.exports = Goal;