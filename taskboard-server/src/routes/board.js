const { Router } = require("express");

const validator = require("../middlewares/validator");
const boardController = require("../controllers/board");

const router = Router();

router.use(validator.isLoggedIn);

// create a board
router.post(
	"/",
	validator.validatePresentInBody("title"),
	validator.validateCharacterLength("title", { min: 1, max: 30 }),
	boardController.saveBoard
);

router.patch(
	"/:boardId",
	validator.validatePathParamPresent("boardId"),
	validator.validatePresentInBody("title"),
	validator.validateCharacterLength("title", { min: 1, max: 30 }),
	boardController.updateBoard
);

module.exports = router;
