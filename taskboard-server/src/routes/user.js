const { Router } = require("express");

const validator = require("../middlewares/validator");
const userController = require("../controllers/user");

const router = Router();

// signup
router.post(
	"/",
	validator.validatePresentInBody("username", "password"),
	validator.validateCharacterLength("username", { min: 3, max: 15 }),
	validator.validateCharacterLength("password", { min: 6, max: 20 }),
	userController.signUp
);

router.post(
	"/login",
	validator.validatePresentInBody("username", "password"),
	validator.validateCharacterLength("username", { min: 3, max: 15 }),
	validator.validateCharacterLength("password", { min: 6, max: 20 }),
	userController.login
);

module.exports = router;
