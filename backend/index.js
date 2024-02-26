const fs = require('fs').promises;
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(express.static('images'));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT,POST,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  next();
});

app.get('/places', async (req, res) => {
  const fileContent = await fs.readFile('./data/places.json');

  const placesData = JSON.parse(fileContent);

  res.status(200).json({ places: placesData });
});

app.get('/user-places', async (req, res) => {
  const fileContent = await fs.readFile('./data/user-places.json');
  const places = JSON.parse(fileContent);

  res.status(200).json({ places });
});

app.put('/user-places', async (req, res) => {
  const places = req.body.places;

  await fs.writeFile('./data/user-places.json', JSON.stringify(places));

  res.status(200).json({ message: 'User Places Updated!' });
});

app.delete('/user-places', async (req, res) => {
  const placeId = req.body.id;

  const fileContent = await fs.readFile('./data/user-places.json');
  const savedUserPlaces = JSON.parse(fileContent);

  const userPlaces = savedUserPlaces.filter((places) => places.id !== placeId);

  await fs.writeFile('./data/user-places.json', JSON.stringify(userPlaces));

  res.status(200).json({ message: 'User Placed Successfully Removed' });
});

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  res.status(404).json({ message: '404 - Not Found' });
});

app.listen(3000, () => {
  console.log('Server running at Port 3000');
});
