const express = require('express');
const path = require('path'); // Add this if not present
const {connectToDatabase} = require('./src/config/database');
const cors = require('cors');
const {setRoutes} = require('./src/routes/app'); 


// const IndexController = require('./src/controllers/index');

const app = express(); // ✅ Move this to the top
const PORT = 3000;
app.use(cors()); // Enable CORS
app.use(express.json());


// ✅ Serve frontend files from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // ✅ Correct
    });


// // API routes -- need to uncomment
// app.get('/stocks', (req, res) => IndexController.getStocks(req, res));
// app.post('/stocks', (req, res) => IndexController.createStock(req, res));
// // app.put('/buy', (req, res) => IndexController.buyStock(req, res))
// app.put('/api/stocks/buy', IndexController.buyStock);   // ✅ updated
// app.put('/api/stocks/sell', IndexController.sellStock)

connectToDatabase()
    .then(() => {
        console.log('Connected to the database.');
        setRoutes(app);
        
        app.listen(PORT, () => {
        console.log(`Server is running on port http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection failed:', error);
    });



// Start server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

