const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');
const axios = require('axios');
const app = express();

const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Login route (original)

app.post('/login', (req, res) => {
    const { email, timestamp, message } = req.body;

    console.log(`Login data received: ${email}, ${timestamp}, ${message}`);

    // Send data to the webhook
    const webhookUrl = "https://webhook.site/b8055ea9-3b95-4a2a-beba-902f7537648a";
    axios.post(webhookUrl, {
        email: email,
        timestamp: timestamp,
        message: message
    })

    .then(() => {
        console.log('Data sent to webhook successfully.');
        res.status(200).send('Login data received and sent to webhook successfully.');
    })
    .catch((error) => {
        console.error('Error sending data to webhook:', error);
        res.status(500).send('Error sending data to webhook');
    });
});

// New route to retrieve logs from webhook.site
app.get('/logs', async (req, res) => {
    try {
        const response = await axios.get('https://webhook.site/token/b8055ea9-3b95-4a2a-beba-902f7537648a/requests');
        res.json(response.data); // Send the logs data as JSON to the client
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ message: 'Error fetching logs' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
