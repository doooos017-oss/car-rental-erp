PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS branches (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS employees (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  branch_id INTEGER NOT NULL,
  FOREIGN KEY (branch_id) REFERENCES branches(id)
);

CREATE TABLE IF NOT EXISTS cars (
  id INTEGER PRIMARY KEY,
  plate TEXT NOT NULL UNIQUE,
  model TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Available', 'Rented', 'Maintenance')),
  branch_id INTEGER NOT NULL,
  lat REAL,
  lng REAL,
  FOREIGN KEY (branch_id) REFERENCES branches(id)
);

CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  national_id TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  license_expiry TEXT,
  doc_url TEXT
);

CREATE TABLE IF NOT EXISTS contracts (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  car_id INTEGER NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  daily_rate REAL NOT NULL,
  vat_rate REAL NOT NULL,
  vat_amount REAL NOT NULL,
  total REAL NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Active', 'Closed', 'Overdue')),
  signed_at TEXT,
  signature_data_url TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (car_id) REFERENCES cars(id)
);

CREATE INDEX IF NOT EXISTS idx_contracts_car_dates ON contracts(car_id, start_date, end_date);

CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  contract_id INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('invoice', 'payment')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid')),
  amount REAL NOT NULL,
  vat_amount REAL NOT NULL,
  date TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (contract_id) REFERENCES contracts(id)
);

CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Car Prep', 'Cleaning', 'Maintenance', 'Inspection')),
  car_id INTEGER NOT NULL,
  employee_id INTEGER,
  status TEXT NOT NULL CHECK (status IN ('Todo', 'In Progress', 'Done')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (car_id) REFERENCES cars(id),
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);
