const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3002

// setup the ability to see into response bodies
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// setup the express assets path
app.use('/', express.static(path.join(__dirname, '../client')))

// API calls ------------------------------------------------------------------------------------
app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '../client/pages/home.html'));
})

let requestQueue = [];
let isProcessing = false;

async function processQueue() {
    if (isProcessing || requestQueue.length === 0) return;

    isProcessing = true;
    const { req, res } = requestQueue.shift();

    // Simulate processing delay (you can replace this with actual logic)
    setTimeout(() => {
        res.sendFile(path.join(__dirname, '../client/pages/race.html'));
        isProcessing = false;
        processQueue(); // Process next request
    }, 500); // Adjust delay based on your needs
}

app.get('/race', async (req, res) => {
    requestQueue.push({ req, res });
    processQueue();
});

app.post('/api/races/:id/accelerate', async (req, res) => {
    const raceId = req.params.id;        
    console.log(`🚗 Accelerating race ${raceId}`);

    // Log incoming request
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 100));

    res.status(200).json({ message: `Race ${raceId} accelerated` }); // ✅ Always respond
});

app.post('/api/races/:raceId/start', async (req, res) => {
    try {
        const { raceId } = req.params;
        console.log(`Starting race ${raceId}`);

        // Simulate a race starting logic (replace with actual logic)
        res.status(200).json({ message: `Race ${raceId} started successfully` });
    } catch (error) {
        console.error("Error starting race:", error);
        res.status(500).json({ error: "Internal Server Error" }); // Ensure JSON response
    }
});

res.setHeader('Access-Control-Allow-Origin', '*');


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
