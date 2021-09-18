const { Router } = require("express");

const validator = require("../middlewares/validator");
const columnController = require("../controllers/column");

const router = Router();

router.use(validator.isLoggedIn);

router.post(
	"/",
	validator.validatePresentInBody("boardId"),
	validator.validatePresentInBody("title"),
	validator.validateCharacterLength("title", { min: 1, max: 30 }),
	columnController.saveColumn
);

router.patch(
	"/:columnId",
	validator.validatePresentInBody("title"),
	validator.validateCharacterLength("title", { min: 1, max: 30 }),
	columnController.updateColumn
);

router.delete(
	"/:columnId",
	validator.validatePresentInBody("boardId"),
	columnController.deleteColumn
);

module.exports = router;
