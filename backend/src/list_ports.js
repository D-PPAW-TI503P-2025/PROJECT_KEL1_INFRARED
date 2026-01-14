
import { SerialPort } from 'serialport';

SerialPort.list().then((ports) => {
    console.log('Available Ports:');
    ports.forEach((port) => {
        console.log(`${port.path}\t${port.pnpId || ''}\t${port.manufacturer || ''}`);
    });
    if (ports.length === 0) {
        console.log('No ports found.');
    }
}).catch((err) => {
    console.error('Error listing ports:', err);
});
