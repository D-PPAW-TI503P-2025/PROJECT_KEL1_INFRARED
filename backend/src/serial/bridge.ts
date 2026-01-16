// src/serial/bridge.ts
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import axios from 'axios';

export function startSerialBridge(onData?: (value: number) => void) {
    const PORT = process.env.SERIAL_PORT || 'COM7';
    const BAUD = Number(process.env.BAUD_RATE || 9600);

    let port: SerialPort | null = null;

    function init() {
        try {
            port = new SerialPort({ path: PORT, baudRate: BAUD, autoOpen: false });

            port.on('error', (err) => {
                console.warn('⚠️ Serial error:', err.message);
            });

            port.open((err) => {
                if (err) {
                    console.warn('⚠️ Serial unavailable:', err.message);
                    // don't exit — just stop trying for now
                    return;
                }
                console.log(`✅ Serial connected: ${PORT}`);
            });

            const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));
            parser.on('data', (line: string) => {
                const m = line.trim().match(/Sensor Value\s*=\s*(\d+)/i);
                if (!m) return;
                const value = Number(m[1]);
                if (value !== 0 && value !== 1) return;

                // local callback (broadcast to WS)
                if (onData) onData(value);

                // send to server api (non-blocking)
                axios.post(`http://localhost:${process.env.PORT || 3000}/api/sensor`, { value })
                    .catch(() => { /* ignore */ });
            });

        } catch (err: any) {
            console.warn('⚠️ Serial init failed:', err.message);
        }
    }

    init();
    // Optionally return a function to close port
    return () => { if (port && port.isOpen) port.close(); };
}
