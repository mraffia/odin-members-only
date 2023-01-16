const User = require("../models/user");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");


exports.index = (req, res, next) => {
    res.render("index", { title: "Members Only" });
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
                                res.redirect("/");
                            });
                        }
                    });
                }
            });
        }
    },
];
  

exports.user_login_get = (req, res, next) => {
    res.send(`NOT IMPLEMENTED`);
};

exports.user_login_post = (req, res, next) => {
    res.send(`NOT IMPLEMENTED`);
};

exports.user_logout_get = (req, res, next) => {
    res.send("NOT IMPLEMENTED");
};

exports.user_join_the_club_get = (req, res, next) => {
    res.send("NOT IMPLEMENTED");
};

exports.user_join_the_club_post = (req, res, next) => {
    res.send("NOT IMPLEMENTED");
};