const {createConnection} = require('mysql2/promise');

// async function connectToDatabase() {
//     try {
//         const connection = await mysql.createConnection({
//             host: 'localhost',
//             user: 'root', // Replace with your MySQL username
//             password: 'n3u3da!', // Replace with your MySQL password
//             database: 'stock_data' // Replace with your database name
//         });
//         console.log('Connected to MySQL database');
//         return connection;
//     } catch (err) {
//         console.error('Database connection failed:', err);
//         throw err;
//     }
// }

const connectToDatabase = async () => {
    const connection = await createConnection({
        host:'localhost',
        user:'root',
        password:'n3u3da!',
        database:'stock_data'  //modify this to your database name
    });
    return connection;
};

module.exports = { connectToDatabase };