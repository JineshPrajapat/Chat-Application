const express = require("express");
const router = express.Router();

const {signUp, login} = require("../controllers/User");

router.post("/signUp", signUp);
router.post("/logIn", login);

module.exports = router;