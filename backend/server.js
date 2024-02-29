const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectToMongoDB = require('./database');
const Nurse = require('./models/Nurse'); // Import the Nurse model

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

connectToMongoDB; // Connect to MongoDB

// Routes
app.get('/api/nurses', async (req, res) => {
  const nurses = await Nurse.find();
  res.json(nurses);
});

app.post('/api/nurses', async (req, res) => {
  const { name, licenseNumber, dob, age } = req.body;
  const nurse = new Nurse({ name, licenseNumber, dob, age });
  
  try {
    const newNurse = await nurse.save();
    res.json(newNurse);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.put('/api/nurses/:id', async (req, res) => {
  const { name, licenseNumber, dob, age } = req.body;
  
  try {
    const nurse = await Nurse.findByIdAndUpdate(
      req.params.id,
      { name, licenseNumber, dob, age },
      { new: true }
    );
    res.json(nurse);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.delete('/api/nurses/:id', async (req, res) => {
  try {
    await Nurse.findByIdAndDelete(req.params.id);
    res.json({ message: 'Nurse deleted successfully' });
  } catch (err) {
    res.status(400).send(err);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
