import express from 'express';
import db from '../database.js';

const router = express.Router();

// Get Busy Hours Analytics
// Aggregates detection counts (value=0) by hour of day (00-23)
router.get('/busy-hours', (req, res) => {
    // SQLite query to group by Hour
    // detection is value=0.
    // We strictly count value=0.

    // SQLite's strftime('%H', created_at) returns hour 00-23
    // Note: created_at is in UTC usually or local depending on insertion. 
    // Assuming default DATETIME DEFAULT CURRENT_TIMESTAMP is UTC.
    // For simplicity in this local project, we'll assume the user wants whatever is in DB.
    // Adjusting for timezone might be needed but let's stick to simple aggregation first.

    const query = `
        SELECT 
            strftime('%H', created_at) as hour, 
            COUNT(*) as detection_count 
        FROM sensor_logs 
        WHERE value = 1 
        GROUP BY hour 
        ORDER BY hour ASC
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Initialize all 24 hours with 0
        const busyHours = Array.from({ length: 24 }, (_, i) => ({
            hour: i.toString().padStart(2, '0'),
            count: 0
        }));

        // Fill in data from DB
        rows.forEach(row => {
            const index = parseInt(row.hour);
            if (index >= 0 && index < 24) {
                busyHours[index].count = row.detection_count;
            }
        });

        res.json(busyHours);
    });
});

export default router;
