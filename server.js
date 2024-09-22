const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Endpoint to handle saving keys to keys.json
app.post('/saveKey', (req, res) => {
    const newKey = req.body;

    // Path to the keys.json file
    const keysFilePath = path.join(__dirname, 'keys.json');

    // Read the current keys.json file
    fs.readFile(keysFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading keys.json:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        let keysArray = [];
        if (data) {
            try {
                keysArray = JSON.parse(data);
            } catch (parseErr) {
                console.error('Error parsing keys.json:', parseErr);
                return res.status(500).json({ message: 'Internal server error' });
            }
        }

        // Add the new key to the array
        keysArray.push(newKey);

        // Write the updated array back to keys.json
        fs.writeFile(keysFilePath, JSON.stringify(keysArray, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing to keys.json:', writeErr);
                return res.status(500).json({ message: 'Internal server error' });
            }

            console.log('Key saved successfully:', newKey);
            return res.status(200).json({ message: 'Key saved successfully' });
        });
    });
});

// Serve the index.html file
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});