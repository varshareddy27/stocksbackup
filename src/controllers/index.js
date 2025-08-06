const mysql = require('mysql2/promise');
const { connectToDatabase } = require('../config/database');

class IndexController {
    constructor() {
        // this.db = null;
        this.initDB();
    }

    async initDB() {
        try {
            this.db = await connectToDatabase();
            console.log('Database initialized');
        } catch (err) {
            console.error('Error initializing database:', err);
        }
    }

    async getStocks(req, res) {
        try {
            const sql = 'SELECT * FROM stock_details';
            const [results] = await this.db.query(sql);
            res.json(results);
        } catch (err) {
            console.error('Error fetching stock data:', err);
            res.status(500).send('Error fetching stock data');
        }
    }

    async createStock(req, res) {
        const {
            user_id,
            username,
            stock_symbol,
            stock_company_name,
            transaction_type,
            quantity,
            price,
            transaction_date,
            sector
        } = req.body;

        // Input validation
        if (
            !user_id ||
            !username ||
            !stock_symbol ||
            !stock_company_name ||
            !transaction_type ||
            !quantity ||
            !price ||
            !transaction_date
        ) {
            return res.status(400).send('Invalid input: All fields are required except sector');
        }

        console.log('Creating stock:', {
            user_id,
            username,
            stock_symbol,
            stock_company_name,
            transaction_type,
            quantity,
            price,
            transaction_date,
            sector
        });

        try {
            const sql = `
                INSERT INTO stock_details (
                    user_id, username, stock_symbol, stock_company_name, transaction_type,
                    quantity, price, transaction_date, sector
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            await this.db.query(sql, [
                user_id,
                username,
                stock_symbol,
                stock_company_name,
                transaction_type,
                quantity,
                price,
                transaction_date,
                sector || null // Allow sector to be optional
            ]);
            res.json({ message: 'Stock created successfully' });
        } catch (err) {
            console.error('Error creating stock:', err);
            res.status(500).send('Error creating stock');
        }
    }  
    async buyStock(req, res) {
        const { user_id, stock_symbol, quantity } = req.body;
      
        if (!user_id || !stock_symbol || !quantity || quantity <= 0) {
          return res.status(400).json({ error: 'User ID, Stock Symbol, and Quantity are required and must be valid.' });
        }
      
        try {
          // Check if record exists
          const [rows] = await this.db.query(
            'SELECT * FROM stock_details WHERE user_id = ? AND stock_symbol = ?',
            [user_id, stock_symbol]
          );
      
          if (rows.length === 0) {
            return res.status(404).json({ error: 'No matching stock record found for this user.' });
          }
      
          const current = rows[0];
          const newQuantity = current.quantity + quantity;
      
          // Calculate new average price
          const newTotalValue = (current.quantity * current.price) + (quantity * current.price); // same price for simplicity
          const newAveragePrice = newTotalValue / newQuantity;
      
          await this.db.query(
            'UPDATE stock_details SET quantity = ?, price = ? WHERE user_id = ? AND stock_symbol = ?',
            [newQuantity, newAveragePrice, user_id, stock_symbol]
          );
      
          res.json({ message: `Bought ${quantity} more of ${stock_symbol}. Quantity updated to ${newQuantity}.` });
        } catch (err) {
          console.error('Buy error:', err);
          res.status(500).json({ error: 'Failed to process buy operation.' });
        }
    }

      async sellStock(req, res) {
        const { user_id, stock_symbol, quantity } = req.body;
      
        try {
          const [[item]] = await this.db.query(
            `SELECT * FROM stock_details WHERE user_id = ? AND stock_symbol = ?`,
            [user_id, stock_symbol]
          );
      
          if (!item) {
            return res.status(404).json({ error: 'Stock not found for user.' });
          }
      
          const currentQty = item.quantity;
          const currentTotal = item.price; // total value stored
      
          if (quantity > currentQty) {
            return res.status(400).json({ error: 'Quantity of stock is unavailable.' });
          } else if (quantity === currentQty) {
            // Delete row if quantity matches
            await this.db.query(`DELETE FROM stock_details WHERE user_id = ?`, [item.user_id]);
            return res.json({ message: 'All stocks sold. Entry removed.' });
          } else {
            const newQty = currentQty - quantity;
            const avgPrice = currentTotal / currentQty;
            const newTotal = newQty * avgPrice;
      
            await this.db.query(
              `UPDATE stock_details SET quantity = ?, price = ? WHERE user_id = ?`,
              [newQty, newTotal, item.user_id]
            );
      
            return res.json({ message: 'Stock sold successfully.' });
          }
        } catch (err) {
          console.error('Sell error:', err);
          res.status(500).json({ error: 'Sell operation failed.' });
        }
      }

}

module.exports = IndexController;