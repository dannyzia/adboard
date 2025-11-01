const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors'); 

// --- Database Connection ---
mongoose.connect('mongodb://localhost/yourdb')
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// --- Database Schema ---
const adSchema = new mongoose.Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
}, { strict: false });

const Ad = mongoose.model('Ad', adSchema);

// --- Express App Setup ---
const app = express();
app.use(cors()); 
app.use(express.json()); 
const upload = multer({ dest: 'uploads/' });

// ==================================================================
// NEW: Import Form Configuration from JSON file
// This happens ONCE at startup and is cached.
// ==================================================================
const formConfig = require('./form-config.json');

// ==================================================================
// API Endpoints
// ==================================================================

// --- ENDPOINT: Serves the form structure to the frontend ---
app.get('/api/form-config', (req, res) => {
  // Just send the variable that was loaded on startup
  res.json(formConfig);
});

// --- ENDPOINT: Handles the form submission ---
app.post('/api/submit-ad', upload.single('image'), async (req, res) => {
  try {
    const data = req.body;
    
    if (req.file) {
      data.imagePath = req.file.path;
    }
    
    // Server-side validation/logic
    if (data.category === 'Free') {
      data.price = 0;
      data.priceType = 'Free';
    }

    const ad = new Ad(data);
    await ad.save();
    res.status(201).send('Ad saved successfully!');
  } catch (error) {
    console.error('Error saving ad:', error);
    res.status(500).send('Error saving ad');
  }
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});