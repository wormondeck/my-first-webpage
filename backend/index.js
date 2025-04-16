const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let jordanOnes = [
    { id: 1, name: 'breds', condition: 'worn', photo: "https://cdn.shopify.com/s/files/1/0094/6307/0798/files/Screenshot_2021-01-19_at_19.55.22_1024x1024.png"},
    { id: 2, name: 'black toe', condition: 'worn', photo: "https://image-cdn.hypb.st/https%3A%2F%2Fhypebeast.com%2Fimage%2F2016%2F10%2Fair-jordan-31-air-jordan-1-black-toe-4.jpg?q=75&w=800&cbr=1&fit=max"},
    { id: 3, name: 'blazer strap kids 77 jungle', condition: 'new', photo: "https://cdn.shopify.com/s/files/1/0603/3031/1875/files/main-square_016ad5d7-c41e-44e0-927c-86b242da55c3.jpg?v=1708319525"},
];

// GET all shoes
app.get('/shoes', (req, res) => {
  res.json(jordanOnes);
});

// POST a new shoe
app.post('/shoes', (req, res) => {
  const newShoe = req.body;
  newShoe.id = jordanOnes.length + 1;
  jordanOnes.push(newShoe);
  res.status(201).json(newShoe);
});

// PATCH a shoe
app.patch('/shoes/:id', (req, res) => {
    const shoeId = parseInt(req.params.id);
    const updateShoeName = req.body;
    const shoeIndex = jordanOnes.findIndex(shoe => shoe.id === shoeId);
    console.log('PATCH incoming:', updateShoeName);
    if (shoeIndex === -1) {
        return res.status(404).send('Shoe not found');
    }
    
    jordanOnes[shoeIndex] = { 
        ...jordanOnes[shoeIndex], 
        ...updateShoeName 
    };
    
    res.json(jordanOnes[shoeIndex]);
    
});

//  DELETE a shoe
app.delete('/shoes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = jordanOnes.findIndex(shoe => shoe.id === id);

    if (index !== -1) {
        const deleted = jordanOnes.splice(index, 1);
        res.json(deleted[0]);
    } else {
        res.status(404).json({ message: 'Shoe not found'});
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));