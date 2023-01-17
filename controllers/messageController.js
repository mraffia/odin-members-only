const Message = require("../models/message");
const User = require("../models/message");
const async = require("async");

exports.message_create_get = (req, res, next) => {
    res.render("message_form", { title: "Create Message" });
};

exports.message_create_post = [
    // Validate and sanitize fields.
    body("title", "Title must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("message_text", "Message text must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Message object with escaped and trimmed data.
        const message = new Message({
            user: req.params.userid,
            title: req.body.title,
            message_text: req.body.message_text,
            timestamp: Date.now(),
        });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            res.render("message_form", {
                title: "Create Message",
                message,
                errors: errors.array(),
            });
            return;
        }

        // Data from form is valid. Save message.
        message.save((err) => {
        if (err) {
            return next(err);
        }
        // Successful: redirect to home page.
        res.redirect("/");
        });
    },
];
  

exports.message_delete_get = (req, res, next) => {
    res.send(`NOT IMPLEMENTED`);
};

exports.message_delete_post = (req, res, next) => {
    res.send(`NOT IMPLEMENTED`);
};
