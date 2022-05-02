const express = require("express");
const controller = require("../controllers/PostController");
const { isLoggedIn, isNotAuthor, isAuthor } = require("../middlewares/auth");

const router = express.Router();

router.get("/:id/new", isLoggedIn, controller.new); //new post
router.post("/:id/create", isLoggedIn, controller.create);
// router.get("/edit", controller.edit);
// router.put("/edit", controller.update);
router.delete("/:GroupID/delete/:id", isLoggedIn, controller.delete);

module.exports = router;
