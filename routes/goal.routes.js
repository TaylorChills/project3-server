const router = require("express").Router();
const mongoose = require("mongoose");

const User = require("../models/User.model");
const Goal = require("../models/Goal.model");
const { response } = require("../app");

router.post("/goals", (req, res, next) => {
  const { name, description, type, frequency, streak } = req.body;
  const { _id } = req.payload;

  Goal.create({ name, description, type, frequency, streak })
    .then((newGoal) => {
      return User.findByIdAndUpdate(
        _id,
        { $push: { goals: newGoal._id } },
        { new: true }
      );
    })
    .then((response) => res.json(response))
    .catch((err) => next(err));
});

router.get("/goals", (req, res, next) => {
  Goal.find()
    .then((response) => res.json(response))
    .then(console.log(response))
    .catch((err) => res.json(err));
});

router.get("/goals/:goalId", (req, res, next) => {
  const { goalId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(goalId)) {
    res.status(400).json({ message: "Specified Id is not valid" });
    return;
  }

  Goal.findById(goalId)
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

router.put("/goals/:goalId", (req, res, next) => {
  const { goalId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(goalId)) {
    res.status(400).json({ message: "Specified Id is not valid" });
    return;
  }

  Goal.findByIdAndUpdate(goalId, req.body, { new: true })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

router.delete("/goals/:goalId", (req, res, next) => {
  const { goalId } = req.params;
  /* const { _id } = req.payload; */

  if (!mongoose.Types.ObjectId.isValid(goalId)) {
    res.status(400).json({ message: "Specified Id is not valid" });
    return;
  }
  Goal.findByIdAndRemove(goalId)
    .then(() => {
      return User.findByIdAndUpdate(_id, { $pull: { goals: goalId } }).then(() =>
        res.json({ message: `Task with ${goalId} was removed successfully` })
      );
    })
    .catch((err) => res.json(err));

});

module.exports = router;
