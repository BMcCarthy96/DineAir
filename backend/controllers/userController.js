const bcrypt = require("bcryptjs");
const { User } = require("../db/models");

exports.getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            attributes: [
                "id",
                "firstName",
                "lastName",
                "email",
                "username",
                "userType",
            ],
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (err) {
        next(err);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { username, phone, password, firstName, lastName, email } =
            req.body;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Ensure only the user or an admin can update the user
        if (req.user.id !== user.id && req.user.userType !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }

        // Update fields if provided
        if (username) user.username = username;
        if (phone) user.phone = phone;
        if (password) user.hashedPassword = await bcrypt.hash(password, 10); // Hash the new password
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email;

        await user.save();

        res.json({ message: "User updated successfully", user });
    } catch (err) {
        console.error("Error updating user:", err);
        next(err);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        await user.destroy();

        res.status(204).end();
    } catch (err) {
        next(err);
    }
};
