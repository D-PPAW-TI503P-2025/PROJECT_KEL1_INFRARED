import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import http from 'http';

// Configuration
const PORT_NAME = 'COM4'; // User specified
const BAUD_RATE = 9600;   // User specified
const API_URL = 'http://localhost:3000/api/sensor';

console.log(`Attempting to connect to ${PORT_NAME} at ${BAUD_RATE} baud...`);

const port = new SerialPort({
    path: PORT_NAME,
    baudRate: BAUD_RATE,
    autoOpen: false,
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

port.open((err) => {
    if (err) {
        return console.log('Error opening port: ', err.message);
    }
    console.log(`Connected to ${PORT_NAME}`);
});

parser.on('data', (data) => {
    const cleanData = data.trim();
    // console.log(`Received: ${cleanData}`); // Debug logging

    // Arduino Code sends:
    // Serial.println(""); -> Newline
    // Serial.print("Sensor Value = ");
    // Serial.print(value);
    // Resulting line: "Sensor Value = 0"

    // Regex to find "Sensor Value = " followed by digits
    const match = cleanData.match(/Sensor Value\s*=\s*(\d+)/i);

    if (match) {
        const value = parseInt(match[1]);
        if (!isNaN(value)) {
            // User confirmed: Value 1 = Detected (IR Sensor Active High logic observed)
            if (value === 1) {
                console.log(`Object Detected! (Value 1) -> Sending to Database`);
                sendToApi(value);
            } else {
                // Value 0 means "No Object"
                console.log(`No Object (Value ${value}) - Ignored`);
            }
        }
    } else {
        // console.log(`Ignored data: ${cleanData}`);
    }
});

function sendToApi(value) {
    const postData = JSON.stringify({ value: value });

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/sensor',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length
        }
    };

    const req = http.request(options, (res) => {
        // console.log(`API Status: ${res.statusCode}`); // Optional logging
        if (res.statusCode !== 201) {
            console.log(`Warning: API returned status ${res.statusCode}`);
        }
    });

    req.on('error', (e) => {
        console.error(`Problem with API request: ${e.message}`);
    });

    req.write(postData);
    req.end();
}

console.log('Sensor Bridge Running. Waiting for data...');
