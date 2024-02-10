function sendToArduino(amount, adminName) {
    const arduinoIP = '192.168.1.10'; // Change this to your Arduino's IP address
    const arduinoPort = 80; // Change this to your Arduino's port

    // Create the data to send to the Arduino
    const data = JSON.stringify({ amount, adminName });

    // Define the HTTP request options
    const options = {
        hostname: arduinoIP,
        port: arduinoPort,
        path: '/receive-data', // Change this to the endpoint on your Arduino to receive data
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };
}
    module.exports = sendToArduino ;