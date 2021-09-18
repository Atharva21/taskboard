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

router.get("/", boardController.getAllBoards);

// get board
router.get(
	"/:boardId",
	validator.validateBoardIsOfUser,
	boardController.getBoard
);

// update state (move around columns/tasks)
router.post(
	"/:boardId",
	validator.validateBoardIsOfUser,
	boardController.updateState
);

// update board title
router.patch(
	"/:boardId",
	validator.validateBoardIsOfUser,
	validator.validatePresentInBody("title"),
	validator.validateCharacterLength("title", { min: 1, max: 30 }),
	boardController.updateBoard
);

// delete board
router.delete(
	"/:boardId",
	validator.validateBoardIsOfUser,
	boardController.deleteBoard
);

module.exports = router;
