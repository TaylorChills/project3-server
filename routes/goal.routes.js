const router = require("express").Router();
const mongoose = require("mongoose");

const User = require("../models/User.model");
const Goal = require("../models/Goal.model");
const { response } = require("../app");

router.post("/goals", (req, res, next) => {
  const { name, description, type, frequency } = req.body;
  const { _id } = req.payload;

  Goal.create({ name, description, type, frequency })
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
  const { _id } = req.payload;
  User.findById(_id)
    .populate("goals")
    .then((response) => res.json(response.goals))
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
  const { _id } = req.payload;

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


const fileUploader = require("../config/cloudinary.config");

router.post("/upload", fileUploader.single("file"), (req, res, next) => {
  console.log("file is: ", req.file)
 
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  res.json({ fileUrl: req.file.path });
});


router.put("/goals/:goalId/send-dates", (req, res, next) => {
  const { goalId } = req.params;
  const datesArr = req.body.value
  console.log(datesArr)

  const currentStreak = checkAccomplishment(datesArr)

  if (!mongoose.Types.ObjectId.isValid(goalId)) {
    res.status(400).json({ message: "Specified Id is not valid" });
    return;
  }

  Goal.findByIdAndUpdate(goalId, {dates: datesArr, streak: currentStreak}, { new: true })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
  
});


function checkAccomplishment(dates) {
	let currentStreak = 0;

	dates.forEach((date, i, arr) => {

        const difference = arr[i + 1] - arr[i]

		if (Math.round((difference) / 86400000) > 1) {
			currentStreak = 0;
            
		}

		if (Math.round(difference / 86400000) == 1) {
			currentStreak++;
        
		}
	});
	return currentStreak + 1;
}

module.exports = router;
