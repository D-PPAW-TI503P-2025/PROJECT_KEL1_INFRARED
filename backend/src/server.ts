import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import { WebSocketServer } from 'ws';

import { syncDatabase } from './models'; // ⬅️ WAJIB
import { startSerialBridge } from './serial/bridge';

import authRoutes from './routes/authRoutes';
import sensorRoutes from './routes/sensorRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();

/* =======================
   MIDDLEWARE
======================= */
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

/* =======================
   ROUTES
======================= */
app.use('/api/auth', authRoutes);
app.use('/api/sensor', sensorRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', userRoutes);

/* =======================
   HTTP + WS SERVER
======================= */
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

function broadcast(data: any) {
    const msg = JSON.stringify(data);
    wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
            client.send(msg);
        }
    });
}

/* =======================
   SERIAL (OPTIONAL)
======================= */
if (process.env.ENABLE_SERIAL === 'true') {
    startSerialBridge((value) => {
        console.log('← Serial value:', value);
        broadcast({ type: 'sensor', value });
    });
} else {
    console.log('ℹ️ Serial bridge disabled');
}

/* =======================
   BOOTSTRAP
======================= */
const PORT = Number(process.env.PORT || 3000);

(async () => {
    try {
        await syncDatabase();
        server.listen(PORT, () => {
            console.log(`🚀 Server listening on port ${PORT}`);
        });
    } catch (err) {
        console.error('❌ Server failed to start:', err);
        process.exit(1);
    }
})();
