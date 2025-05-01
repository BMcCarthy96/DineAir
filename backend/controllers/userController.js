const { User } = require("../db/models");
const bcrypt = require("bcryptjs");
const { setTokenCookie } = require("../utils/auth");
const { Op } = require("sequelize");

exports.signup = async (req, res, next) => {
    const { firstName, lastName, email, password, username } = req.body;

    try {
        // Check for existing username or email
        const existingUser = await User.findOne({
            where: { [Op.or]: [{ username }, { email }] },
        });

        if (existingUser) {
            return next({
                status: 500,
                message: "User already exists",
                errors: {
                    username: "User with that username already exists",
                    email: "User with that email already exists",
                },
            });
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            username,
            hashedPassword: bcrypt.hashSync(password),
        });

        const safeUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
        };

        await setTokenCookie(res, safeUser);

        return res.status(201).json({ user: safeUser });
    } catch (err) {
        return next(err);
    }
};
