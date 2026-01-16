import express from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/User';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authenticateToken);
router.use(requireAdmin);

// List
router.get('/', async (_req, res) => {
    const users = await User.findAll({
        attributes: ['id', 'name', 'email', 'role', 'created_at'],
    });
    res.json(users);
});

// Create
router.post('/', async (req, res) => {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
        });

        res.status(201).json({ id: user.getDataValue('id'), message: 'User created' });
    } catch (err: any) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: err.message });
    }
});

// Update
router.put('/:id', async (req, res) => {
    const { name, email, role, password } = req.body;
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (password) {
        user.set('password', await bcrypt.hash(password, 10));
    }

    user.set({ name, email, role });
    await user.save();

    res.json({ message: 'User updated' });
});

// Delete
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await User.destroy({ where: { id } });
    res.json({ message: 'User deleted' });
});

export default router;
