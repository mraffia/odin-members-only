const User = require("../models/user");
const passport = require("passport");
const bcrypt = require("bcryptjs");

exports.index = (req, res, next) => {
    res.render("index", { title: "Members Only" });
};

exports.user_signup_get = (req, res, next) => {
    res.render("signup_form", { title: "Sign Up" });
};

exports.user_signup_post = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) {
            return next(err);
        } else {
            const is_admin_status = req.body.is_admin ? true : false;

            const user = new User({
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
};

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