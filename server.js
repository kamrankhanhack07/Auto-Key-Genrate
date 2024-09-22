const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/saveKey', (req, res) => {
    const keyObject = req.body;

    // Path to the keys.json file
    const keysFilePath = path.join(__dirname, 'public', 'keys.json');

    // Read the existing keys
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
        keysArray.push(keyObject);

        // Write the updated keys array back to keys.json
        fs.writeFile(keysFilePath, JSON.stringify(keysArray, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error writing to keys.json:', writeErr);
                return res.status(500).json({ message: 'Error saving key' });
            }

            console.log('Key saved successfully');
            res.status(200).json({ message: 'Key saved successfully' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
