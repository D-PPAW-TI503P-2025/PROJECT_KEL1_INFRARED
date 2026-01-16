import express from 'express';
import { sequelize } from '../config/database';
import { QueryTypes } from 'sequelize';

const router = express.Router();

router.get('/busy-hours', async (_req, res) => {
    const rows = await sequelize.query<
        { hour: string; detection_count: number }
    >(
        `
    SELECT 
      LPAD(HOUR(created_at), 2, '0') as hour,
      COUNT(*) as detection_count
    FROM sensor_logs
    WHERE value = 1
    GROUP BY hour
    ORDER BY hour ASC
    `,
        { type: QueryTypes.SELECT }
    );

    const busyHours = Array.from({ length: 24 }, (_, i) => ({
        hour: i.toString().padStart(2, '0'),
        count: 0,
    }));

    rows.forEach((row) => {
        const idx = parseInt(row.hour);
        if (idx >= 0 && idx < 24) {
            busyHours[idx].count = row.detection_count;
        }
    });

    res.json(busyHours);
});

export default router;
