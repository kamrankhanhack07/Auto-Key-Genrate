const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors()); // Allow requests from different origins
app.use(bodyParser.json()); // Parse incoming JSON requests

// Path to the keys.json file
const keysFilePath = path.join(__dirname, 'keys.json');

// Endpoint to save the generated key
app.post('/save-key', (req, res) => {
    const newKeyData = req.body;

    // Read the existing keys.json file
    fs.readFile(keysFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading keys.json:', err);
            return res.status(500).json({ message: 'Failed to read keys.json file.' });
        }

        let keysArray = [];
        if (data) {
            try {
                keysArray = JSON.parse(data);
            } catch (jsonError) {
                console.error('Error parsing keys.json:', jsonError);
                return res.status(500).json({ message: 'Error parsing keys.json file.' });
            }
        }

        // Append the new key data
        keysArray.push(newKeyData);

        // Save the updated keys back to keys.json
        fs.writeFile(keysFilePath, JSON.stringify(keysArray, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing to keys.json:', writeErr);
                return res.status(500).json({ message: 'Failed to save key to keys.json file.' });
            }

            res.status(200).json({ message: 'Key successfully saved!' });
        });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
