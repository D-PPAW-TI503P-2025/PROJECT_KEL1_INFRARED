import { sequelize } from '../config/database';

import './User';
import './SensorLog';

export async function syncDatabase() {
    try {
        await sequelize.sync({ alter: true });
        console.log('✅ Database synced');
    } catch (err) {
        console.error('❌ DB sync failed:', err);
    }
}
