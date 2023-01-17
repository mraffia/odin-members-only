const Message = require("../models/message");
const User = require("../models/user");
const async = require("async");
const { body, validationResult } = require("express-validator");

exports.message_create_get = (req, res, next) => {
    async.parallel(
      {
        user(callback) {
          User.findById(req.params.userid)
            .exec(callback);
        },
      },
      (err, results) => {
        if (err) {
          return next(err);
        }
        res.render("message_form", {
          title: "Create A New Message",
          user: results.user,
        });
      }
    );
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
            user: req.body.userid,
            title: req.body.title,
            message_text: req.body.message_text,
            timestamp: Date.now(),
        });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            res.render("message_form", {
                title: "Create A New Message",
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
    async.parallel(
      {
        message(callback) {
          Message.findById(req.params.id)
            .populate("user")
            .exec(callback);
        },
      },
      (err, results) => {
        if (err) {
          return next(err);
        }
        if (results.message == null) {
          // No results.
          res.redirect("/");
        }
        // Successful, so render.
        res.render("message_delete", {
          title: "Delete Message",
          message: results.message,
        });
      }
    );
};

exports.message_delete_post = (req, res, next) => {
    async.parallel(
      {
        message(callback) {
          Message.findById(req.body.messageid)
            .populate("user")
            .exec(callback);
        },
      },
      (err, results) => {
        if (err) {
          return next(err);
        }
        
        Message.findByIdAndRemove(req.body.messageid, (err) => {
          if (err) {
            return next(err);
          }
          res.redirect("/");
        });
      }
    );
};
