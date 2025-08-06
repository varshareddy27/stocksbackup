// const express = require('express');
// const {connectToDatabase} = require('./config/database');
// //const cors= require('cors');
// const IndexController = require('../controllers/index');
// const indexController = new IndexController();

// const {setRoutes}= require('./routes/index');


// const app= express();
// const PORT=process.env.PORT || 3500;
// //enable cors//app.use(cors());

// app.use(express.json());

// connectToDatabase()
// .then(() => {
//     console.log('Connected to the database');
//     setRoutes(app);
//     app.listen(PORT, () => {
//         console.log(`Server running at http://localhost:${PORT}`);
//     });
// })
// .catch(err => {
//     console.error('Database connection failed:', err);
// })



const {Router} = require('express');
const IndexController = require('../controllers/index');
const indexController = new IndexController();


const router = Router();

function setRoutes(app) {
    app.use('/api/stocks', router);
    
    // Define the routes
    router.get('/', indexController.getStocks.bind(indexController));
    // router.get('/:id', indexController.getItemById.bind(indexController));
    router.post('/', indexController.createStock.bind(indexController));
    router.put('/buy', indexController.buyStock.bind(indexController));  // buy operation
    router.put('/sell', indexController.sellStock.bind(indexController));


    // router.put('/:id', indexController.updateItem.bind(indexController));   // ✅ PUT
    // router.delete('/:id', indexController.deleteItem.bind(indexController)); // ✅ DELETE
}

module.exports = {setRoutes};