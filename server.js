import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

// Ensure the assets directory exists
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'assets/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

app.post('/api/save-image', upload.single('image'), (req, res) => {
    res.status(200).send('Image saved successfully');
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});