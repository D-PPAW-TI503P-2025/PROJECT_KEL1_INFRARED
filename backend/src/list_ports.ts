import { SerialPort } from 'serialport';

async function listPorts() {
    try {
        const ports = await SerialPort.list();

        if (ports.length === 0) {
            console.log('❌ No serial ports found');
            return;
        }

        console.log('✅ Available Serial Ports:');
        ports.forEach((port) => {
            console.log(
                `${port.path}\t${port.manufacturer ?? ''}\t${port.serialNumber ?? ''}`
            );
        });
    } catch (err) {
        console.error('Error listing ports:', err);
    }
}

void listPorts();
