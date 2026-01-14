import express from 'express';
import bcrypt from 'bcrypt';
import db from '../database.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply middleware to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// List Users
router.get('/', (req, res) => {
    db.all(`SELECT id, name, email, role, created_at FROM users`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Create User (Admin only)
router.post('/', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(`INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
            [name, email, hashedPassword, role || 'user'],
            function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ error: 'Email already exists' });
                    }
                    return res.status(500).json({ error: err.message });
                }
                res.status(201).json({ id: this.lastID, message: 'User created' });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update User
router.put('/:id', async (req, res) => {
    const { name, email, role, password } = req.body;
    const { id } = req.params;

    // For password update, we need to handle it separately or conditionally
    // If password provided, hash it.

    if (password) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            db.run(`UPDATE users SET name = ?, email = ?, role = ?, password = ? WHERE id = ?`,
                [name, email, role, hashedPassword, id],
                function (err) {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ message: 'User updated' });
                }
            );
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    } else {
        db.run(`UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?`,
            [name, email, role, id],
            function (err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'User updated' });
            }
        );
    }
});

// Delete User
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM users WHERE id = ?`, [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'User deleted' });
    });
});

export default router;
