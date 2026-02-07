import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { db, migrate, isSeeded } from './db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

// Initialize database
try {
    migrate()
    if (!isSeeded()) {
        console.log('Database seeded successfully')
    }
} catch (error) {
    console.error('Database initialization error:', error.message)
}

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Get all cars
app.get('/api/cars', (req, res) => {
    try {
        const cars = db.prepare('SELECT * FROM cars').all()
        res.json(cars)
    } catch (error) {
        console.error('Error fetching cars:', error)
        res.status(500).json({ error: error.message })
    }
})

// Get all customers
app.get('/api/customers', (req, res) => {
    try {
        const customers = db.prepare('SELECT * FROM customers').all()
        res.json(customers)
    } catch (error) {
        console.error('Error fetching customers:', error)
        res.status(500).json({ error: error.message })
    }
})

// Get all contracts
app.get('/api/contracts', (req, res) => {
    try {
        const contracts = db.prepare('SELECT * FROM contracts').all()
        res.json(contracts)
    } catch (error) {
        console.error('Error fetching contracts:', error)
        res.status(500).json({ error: error.message })
    }
})

// Create a new car
app.post('/api/cars', (req, res) => {
    try {
        const { plate, model, status, branch_id, lat, lng } = req.body
        const stmt = db.prepare(`
      INSERT INTO cars (plate, model, status, branch_id, lat, lng)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
        const result = stmt.run(plate, model, status || 'Available', branch_id || 1, lat, lng)
        res.json({ id: result.lastInsertRowid, ...req.body })
    } catch (error) {
        console.error('Error creating car:', error)
        res.status(500).json({ error: error.message })
    }
})

// Create a new customer
app.post('/api/customers', (req, res) => {
    try {
        const { name, national_id, phone, license_expiry, doc_url } = req.body
        const stmt = db.prepare(`
      INSERT INTO customers (name, national_id, phone, license_expiry, doc_url)
      VALUES (?, ?, ?, ?, ?)
    `)
        const result = stmt.run(name, national_id, phone, license_expiry, doc_url)
        res.json({ id: result.lastInsertRowid, ...req.body })
    } catch (error) {
        console.error('Error creating customer:', error)
        res.status(500).json({ error: error.message })
    }
})

// Create a new contract
app.post('/api/contracts', (req, res) => {
    try {
        const { customer_id, car_id, start_date, end_date, daily_rate, vat_rate, vat_amount, total, status } = req.body
        const stmt = db.prepare(`
      INSERT INTO contracts (customer_id, car_id, start_date, end_date, daily_rate, vat_rate, vat_amount, total, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
        const result = stmt.run(customer_id, car_id, start_date, end_date, daily_rate, vat_rate, vat_amount, total, status || 'Active')
        res.json({ id: result.lastInsertRowid, ...req.body })
    } catch (error) {
        console.error('Error creating contract:', error)
        res.status(500).json({ error: error.message })
    }
})

// Update a car
app.put('/api/cars/:id', (req, res) => {
    try {
        const { id } = req.params
        const { plate, model, status, branch_id, lat, lng } = req.body
        const stmt = db.prepare(`
      UPDATE cars SET plate = ?, model = ?, status = ?, branch_id = ?, lat = ?, lng = ?
      WHERE id = ?
    `)
        stmt.run(plate, model, status, branch_id, lat, lng, id)
        res.json({ id, ...req.body })
    } catch (error) {
        console.error('Error updating car:', error)
        res.status(500).json({ error: error.message })
    }
})

// Delete a car
app.delete('/api/cars/:id', (req, res) => {
    try {
        const { id } = req.params
        db.prepare('DELETE FROM cars WHERE id = ?').run(id)
        res.json({ success: true })
    } catch (error) {
        console.error('Error deleting car:', error)
        res.status(500).json({ error: error.message })
    }
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err)
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    })
})

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
})

export default app
