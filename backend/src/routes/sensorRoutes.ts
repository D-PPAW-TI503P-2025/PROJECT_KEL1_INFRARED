import express from 'express';
import { SensorLog } from '../models/SensorLog';

const router = express.Router();

router.post('/', async (req, res) => {
    const { value } = req.body;

    if (value === undefined || (value !== 0 && value !== 1)) {
        return res.status(400).json({ error: 'Invalid sensor value. Must be 0 or 1.' });
    }

    const sensorId = 'IR_SENSOR_01';

    const now = new Date();
    const wibTime = new Date(
        now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
    );

    await SensorLog.create({
        sensor_id: sensorId,
        value,
        created_at: wibTime,
    });

    res.status(201).json({ message: 'Data logged successfully' });
});

export default router;
