import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'secret_key_123';

// Register
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    const userRole = role === 'admin' ? 'admin' : 'user';

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
            role: userRole,
        });

        res.status(201).json({
            message: 'User registered successfully',
        });
    } catch (err: any) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.getDataValue('password'));
    if (!validPassword) {
        return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign(
        {
            id: user.getDataValue('id'),
            email: user.getDataValue('email'),
            role: user.getDataValue('role'),
        },
        SECRET_KEY,
        { expiresIn: '1h' }
    );

    res.json({
        token,
        role: user.getDataValue('role'),
        name: user.getDataValue('name'),
    });
});

export default router;
