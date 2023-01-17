var express = require('express');
var router = express.Router();

// Require controller modules.
const user_controller = require("../controllers/userController");
const message_controller = require("../controllers/messageController");

/// USER ROUTES ///

router.get("/", user_controller.index);

router.get("/signup", user_controller.user_signup_get);

router.post("/signup", user_controller.user_signup_post);

router.get("/login", user_controller.user_login_get);

// router.post("/login", user_controller.user_login_post);

// router.get("/logout", user_controller.user_logout_get);

router.get("/jointheclub/:id", user_controller.user_jointheclub_get);

router.post("/jointheclub/:id", user_controller.user_jointheclub_post);

/// MESSAGE ROUTES ///

router.get("/message-create", message_controller.message_create_get);

router.post("/message-create", message_controller.message_create_post);

router.get("/message-delete/:id", message_controller.message_delete_get);

router.post("/message-delete/:id", message_controller.message_delete_post);

module.exports = router;
