const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const goalSchema = new Schema(
  {
    name: String,

    description: String,
    
    type: String,

    frequency: Number,

    /* Change the streak to zero? */
    streak: 0,
  }
     
);

const Goal = model("Goal", goalSchema);

module.exports = Goal;