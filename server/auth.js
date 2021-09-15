const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const router = express.Router();

router.post(
  "/",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("password", "password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    //If there are error return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //check whether the email exists already
    try {
      let user = await User.findOne({ number: req.body.number });
      if (user) {
        return res
          .status(400)
          .json({ error: "sorry a user with this number already exists" });
      }
      user = await User.create({
        number: req.body.number,
        password: req.body.password,
      });
      res.json(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured");
    }
  }
);

module.exports = router;
