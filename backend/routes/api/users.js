const express = require("express");
const router = express.Router();
const { requireAuth } = require("../../utils/auth");
const {
    getUserById,
    updateUser,
    deleteUser,
} = require("../../controllers/userController");

// Get user by ID
router.get("/:id", requireAuth, getUserById);

// Update user
router.put("/:id", requireAuth, updateUser);

// Delete user
router.delete("/:id", requireAuth, deleteUser);

module.exports = router;
