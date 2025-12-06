const http = require('http');

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/reports',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
        console.log('No more data in response.');
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(JSON.stringify({
    reportedEntity: "674e8b3b6b3b3b3b3b3b3b3b", // Dummy ID
    entityType: "Product",
    reason: "Test report"
}));
req.end();
