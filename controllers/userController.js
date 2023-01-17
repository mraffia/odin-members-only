const User = require("../models/user");
const Message = require("../models/message");
const async = require("async");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");


exports.index = (req, res, next) => {
    async.parallel(
        {
            messages(callback) {
                Message.find({})
                    .sort({ timestamp: -1 })
                    .populate("user")
                    .exec(callback);
            },
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            res.render("index", {
                title: "Members Only",
                messages: results.messages,
                user: req.user
            });
        }
    );
};

exports.user_signup_get = (req, res, next) => {
    res.render("signup_form", { title: "Sign Up" });
};

exports.user_signup_post = [
    // Validate and sanitize fields.
    body("name", "Name must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("username", "Username must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("password", "Password must be at least 5 characters long.")
        .isLength({ min: 5 }),
    body('confirm_password').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
    
        // Indicates the success of this synchronous custom validator
        return true;
    }),
  
    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
    
        const is_admin_status = req.body.is_admin ? true : false;

        const user = new User({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password,
            is_member: false,
            is_admin: is_admin_status,
        })
  
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            res.render("signup_form", {
                title: "Sign Up",
                user,
                errors: errors.array(),
            });
            return;
        } else {
            // Data from form is valid.
            // Check if User with same username already exists.
            User.findOne({ username: req.body.username }).exec((err, found_user) => {
                if (err) {
                    return next(err);
                }
                if (found_user) {
                    // User exists, redirect to its detail page.
                    res.render("signup_form", {
                        title: "Sign Up",
                        notice: "Can't use that username, it already exist!",
                        user,
                        errors: errors.array(),
                    });
                } else {
                    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                        if (err) {
                            return next(err);
                        } else {
                            const userFinal = new User({
                                name: req.body.name,
                                username: req.body.username,
                                password: hashedPassword,
                                is_member: false,
                                is_admin: is_admin_status,
                            }).save(err => {
                                if (err) { 
                                    return next(err);
                                }
                                res.redirect("/login");
                            });
                        }
                    });
                }
            });
        }
    },
];
  

exports.user_login_get = (req, res, next) => {
    res.render("login_form", { title: "Log In" });
};

// exports.user_login_post = (req, res, next) => {
//     res.send("NOT IMPLEMENTED");
// };

// exports.user_logout_get = (req, res, next) => {
//     res.send("NOT IMPLEMENTED");
// };

exports.user_jointheclub_get = (req, res, next) => {
    res.render("jointheclub_form", { title: "Join The Club" });
};

exports.user_jointheclub_post = [
    // Validate and sanitize fields.
    body("answer", "Answer must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
  
    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            res.render("jointheclub_form", {
                title: "Join the Club",
                errors: errors.array(),
            });
            return;
        } else {
            const theanswer = req.body.answer.toLowerCase();

            if (theanswer != "the future" && theanswer != "future") {
                res.render("jointheclub_form", {
                    title: "Join The Club",
                    notice: "Wrong answer! Try again!",
                });
                return;
            }
        }

        async.parallel(
            {
                user(callback) {
                    User.findById(req.params.id).exec(callback);
                },
            },
            (err, results) => {
                if (err) {
                    return next(err);
                }

                const user = new User({
                    name: results.user.name,
                    username: results.user.username,
                    password: results.user.password,
                    is_member: true,
                    is_admin: results.user.is_admin,
                    _id: req.params.id,
                });

                User.findByIdAndUpdate(req.params.id, user, {}, (err, theuser) => {
                    if (err) {
                      return next(err);
                    }
              
                    res.redirect("/");
                });
            }
        );
    },
];