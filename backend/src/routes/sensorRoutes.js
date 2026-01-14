import express from 'express';
import db from '../database.js';

const router = express.Router();

// Receive Sensor Data
// Payload: { value: 0 | 1 }
// 0 = object detected, 1 = no object
router.post('/', (req, res) => {
    const { value } = req.body;

    // Simple validation
    if (value === undefined || (value !== 0 && value !== 1)) {
        return res.status(400).json({ error: 'Invalid sensor value. Must be 0 or 1.' });
    }

    const sensorId = 'IR_SENSOR_01'; // Default sensor ID for this project

    // Get current time in WIB (Asia/Jakarta)
    const now = new Date();
    // Offset for WIB is UTC+7
    // SQLite expects format: YYYY-MM-DD HH:MM:SS
    const wibTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));

    // Manual formatting to ensure YYYY-MM-DD HH:MM:SS
    const pad = (num) => num.toString().padStart(2, '0');
    const created_at = `${wibTime.getFullYear()}-${pad(wibTime.getMonth() + 1)}-${pad(wibTime.getDate())} ${pad(wibTime.getHours())}:${pad(wibTime.getMinutes())}:${pad(wibTime.getSeconds())}`;

    db.run(`INSERT INTO sensor_logs (sensor_id, value, created_at) VALUES (?, ?, ?)`,
        [sensorId, value, created_at],
        (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Data logged successfully' });
        }
    );
});

export default router;
