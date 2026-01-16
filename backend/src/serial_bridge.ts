import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import http from 'http';

// ===== CONFIG =====
const SERIAL_PORT = 'COM7';
const BAUD_RATE = 9600;
const API_HOST = 'localhost';
const API_PORT = 3000;
const API_PATH = '/api/sensor';
// ==================

console.log(`Connecting to ${SERIAL_PORT} @ ${BAUD_RATE} baud...`);

const port = new SerialPort({
    path: SERIAL_PORT,
    baudRate: BAUD_RATE,
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

port.on('open', () => {
    console.log('Serial connected');
});

parser.on('data', (line: string) => {
    const text = line.trim();
    const match = text.match(/Sensor Value\s*=\s*(\d+)/i);

    if (!match) return;

    const value = Number(match[1]);
    if (value !== 0 && value !== 1) return;

    console.log(`Sensor value ${value} → sending to API`);
    sendToApi(value);
});

function sendToApi(value: number) {
    const body = JSON.stringify({ value });

    const req = http.request(
        {
            hostname: API_HOST,
            port: API_PORT,
            path: API_PATH,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body),
            },
        },
        (res) => {
            if (res.statusCode !== 201) {
                console.warn(`API responded ${res.statusCode}`);
            }
        }
    );

    req.on('error', (err) => {
        console.error('API error:', err.message);
    });

    req.write(body);
    req.end();
}

console.log('Serial bridge running…');
