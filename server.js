const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI || 'mongodb://db:27017/threetier';

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(error => console.error('MongoDB connection error:', error));

mongoose.connection.on('error', error => console.error('MongoDB connection error event:', error));

const ItemSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model('Item', ItemSchema);

app.get('/api/data', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

app.post('/api/data', async (req, res) => {
  const item = new Item(req.body);
  await item.save();
  res.json(item);
});

app.post('/api/seed', async (req, res) => {
  const sampleItems = [
    { name: 'Sample Item 1' },
    { name: 'Sample Item 2' },
    { name: 'Sample Item 3' }
  ];
  const inserted = await Item.insertMany(sampleItems);
  res.json({ inserted: inserted.length });
});

app.listen(3001, () => {
  console.log('Backend running on port 3001');
});