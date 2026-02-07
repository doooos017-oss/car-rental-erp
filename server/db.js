import Database from 'better-sqlite3'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dataDir = path.join(__dirname, 'data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

const dbPath = process.env.DB_PATH || path.join(dataDir, 'erp.db')
export const db = new Database(dbPath)

export function migrate() {
  const schemaPath = path.join(__dirname, 'schema.sql')
  const schema = fs.readFileSync(schemaPath, 'utf-8')
  db.exec(schema)
}

export function transaction(fn) {
  const tx = db.transaction(fn)
  return tx()
}

export function isSeeded() {
  const row = db.prepare('SELECT COUNT(1) as c FROM cars').get()
  return (row?.c || 0) > 0
}
