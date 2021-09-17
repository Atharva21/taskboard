const { Router } = require("express");

const validator = require("../middlewares/validator");
const taskController = require("../controllers/task");

const router = Router();

router.use(validator.isLoggedIn);

// create a task
router.post(
	"/",
	validator.validatePresentInBody("columnId"),
	validator.validatePresentInBody("content"),
	validator.validateCharacterLength("content", { min: 1, max: 60 }),
	taskController.saveTask
);

// update a task
router.patch(
	"/:taskId",
	validator.validatePresentInBody("content"),
	validator.validateCharacterLength("content", { min: 1, max: 60 }),
	taskController.updateTask
);

// delete task
router.delete(
	"/:taskId",
	validator.validatePresentInBody("columnId"),
	taskController.deleteTask
);

module.exports = router;
