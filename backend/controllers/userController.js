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
        const { firstName, lastName, email, username } = req.body;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        await user.update({ firstName, lastName, email, username });

        res.json(user);
    } catch (err) {
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
