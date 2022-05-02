const express = require("express");
const controller = require("../controllers/groupController");
const { isLoggedIn, isNotAuthor, isAuthor } = require("../middlewares/auth");
const { validateId, validateConnection } = require("../middlewares/validator");

const router = express.Router();

router.get("/", isLoggedIn, controller.yourGroups);
router.get("/allGroups", controller.allGroups);
router.get("/new", isLoggedIn, controller.new);
router.post("/new", isLoggedIn, controller.create);
router.get("/:id", controller.showGroup);
//router.get("/:id/addMember", controller.addMember);
router.put("/:id/joinGroup", isLoggedIn, controller.joinGroup);


module.exports = router;
