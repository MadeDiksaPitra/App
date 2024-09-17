const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const helmet = require('helmet'); // Import Helmet.js

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet()); // Tambahkan Helmet untuk keamanan HTTP header

// Path ke file password yang di-mount oleh Docker Secrets melalui environment variable
const passwordFilePath = process.env.MONGO_PASSWORD_FILE;

// Fungsi untuk membaca file password
const getMongoPassword = () => {
  if (passwordFilePath) {
    try {
      // Membaca password dari file yang ditentukan di environment variable
      return fs.readFileSync(passwordFilePath, 'utf8').trim();
    } catch (err) {
      console.error('Error reading MongoDB password file:', err);
      process.exit(1);  // Keluar dari proses jika terjadi kesalahan
    }
  } else {
    console.error('MongoDB password file path is not defined.');
    process.exit(1);  // Keluar jika path tidak didefinisikan
  }
};

// Mendapatkan password MongoDB dari file
const mongoPassword = getMongoPassword();

console.log("MongoDB Password:", mongoPassword);

// Membentuk URI MongoDB dengan password dari secret
const mongoUri = `mongodb://admin:${mongoPassword}@mongo:27017/notepad`;

// Koneksi ke MongoDB
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Failed to connect to MongoDB', err));

// Schema untuk Notepad
const noteSchema = new mongoose.Schema({
  content: String,
});

const Note = mongoose.model('Note', noteSchema);

// Route Utama
app.get('/', (req, res) => {
  res.send('Welcome to the Notepad API');
});

// Route untuk Mendapatkan Semua Catatan (READ)
app.get('/api/notes', async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notes' });
  }
});

// Route untuk Membuat Catatan Baru (CREATE)
app.post('/api/notes', async (req, res) => {
  try {
    const newNote = new Note({
      content: req.body.content,
    });
    await newNote.save();
    res.json(newNote);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create note' });
  }
});

// Route untuk Memperbarui Catatan Berdasarkan ID (UPDATE)
app.put('/api/notes/:id', async (req, res) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, { content: req.body.content }, { new: true });
    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(updatedNote);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update note' });
  }
});

// Route untuk Menghapus Catatan Berdasarkan ID (DELETE)
app.delete('/api/notes/:id', async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete note' });
  }
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
