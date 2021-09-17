const { Router } = require("express");

const validator = require("../middlewares/validator");

const router = Router();

router.use(validator.isLoggedIn);

module.exports = router;
