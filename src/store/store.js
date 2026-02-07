import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { initialData } from '../data/mock.js'

const calcTotals = (contracts, transactions) => {
  const revenue = transactions.filter(t => t.type === 'payment').reduce((a, b) => a + b.amount, 0)
  const pending = transactions.filter(t => t.status === 'pending').reduce((a, b) => a + b.amount, 0)
  const overdue = contracts.filter(c => c.status === 'Overdue').length
  return { revenue, pending, overdue }
}

export const useERP = create(devtools((set, get) => ({
  cars: initialData.cars,
  customers: initialData.customers,
  contracts: initialData.contracts,
  tasks: initialData.tasks,
  branches: initialData.branches,
  employees: initialData.employees,
  transactions: initialData.transactions,
  transfers: initialData.transfers,
  totals: calcTotals(initialData.contracts, initialData.transactions),
  filters: { date: null, status: 'All', branch: 'All' },
  setFilter: (key, value) => set(state => ({ filters: { ...state.filters, [key]: value } })),
  openContract: (contract) => {
    set(state => {
      // Validation: Check if car is already rented or in maintenance
      const car = state.cars.find(c => c.id === contract.carId)
      if (car.status !== 'Available') {
        throw new Error('السيارة غير متاحة حالياً (مؤجرة أو في الصيانة)')
      }
      
      const cars = state.cars.map(c => c.id === contract.carId ? { ...c, status: 'Rented' } : c)
      const tasks = [...state.tasks, { id: Date.now(), title: 'Car Prep', type: 'Car Prep', carId: contract.carId, employeeId: null, status: 'Todo' }]
      const transactions = [...state.transactions, { id: Date.now() + 1, type: 'invoice', status: 'pending', amount: contract.total, vat: contract.vat, date: new Date().toISOString(), contractId: contract.id }]
      const contracts = [...state.contracts, { ...contract, status: 'Active' }]
      return { cars, tasks, transactions, contracts, totals: calcTotals(contracts, transactions) }
    })
  },
  completeTask: (taskId) => {
    set(state => {
      const task = state.tasks.find(t => t.id === taskId)
      const tasks = state.tasks.map(t => t.id === taskId ? { ...t, status: 'Done' } : t)
      let cars = state.cars
      
      // If maintenance is done, car becomes available
      if (task && task.type === 'Maintenance') {
        cars = cars.map(c => c.id === task.carId ? { ...c, status: 'Available' } : c)
      }
      // If Post-Rental Inspection is done, car becomes available
      if (task && task.type === 'Inspection') {
         cars = cars.map(c => c.id === task.carId ? { ...c, status: 'Available' } : c)
      }

      return { tasks, cars }
    })
  },
  assignTask: (taskId, employeeId) => {
    set(state => ({
      tasks: state.tasks.map(t => t.id === taskId ? { ...t, employeeId } : t)
    }))
  },
  logPayment: (contractId, amount) => {
    set(state => {
      const transactions = state.transactions.map(t => t.contractId === contractId && t.type === 'invoice' ? { ...t, status: 'paid' } : t)
      transactions.push({ id: Date.now(), type: 'payment', status: 'paid', amount, vat: 0, date: new Date().toISOString(), contractId })
      const totals = calcTotals(state.contracts, transactions)
      return { transactions, totals }
    })
  },
  transferCar: (carId, toBranchId) => {
    set(state => {
      const cars = state.cars.map(c => c.id === carId ? { ...c, branchId: toBranchId } : c)
      const transfers = [...state.transfers, { id: Date.now(), carId, toBranchId, date: new Date().toISOString() }]
      return { cars, transfers }
    })
  },
  closeContract: (contractId) => {
    set(state => {
      const contracts = state.contracts.map(c => c.id === contractId ? { ...c, status: 'Closed' } : c)
      const contract = state.contracts.find(c => c.id === contractId)
      
      // Car stays 'Rented' (or 'Maintenance') until inspection is done
      // Create Post-Rental Inspection Task
      const tasks = [...state.tasks, { 
        id: Date.now(), 
        title: 'Post-Rental Inspection', 
        type: 'Inspection', 
        carId: contract.carId, 
        employeeId: null, 
        status: 'Todo' 
      }]
      
      // Mark car as 'Maintenance' temporarily until inspection passes? Or keep as Rented?
      // Requirement: "Automatically create a 'Post-Rental Inspection' task whenever a car is returned."
      // Usually car is not available until inspection. Let's set to 'Maintenance' for safety.
      const cars = state.cars.map(c => c.id === contract.carId ? { ...c, status: 'Maintenance' } : c)

      return { contracts, cars, tasks }
    })
  },
  markOverdue: () => {
    set(state => {
      const contracts = state.contracts.map(c => {
        const due = new Date(c.endDate)
        const now = new Date()
        if (c.status === 'Active' && due < now) return { ...c, status: 'Overdue' }
        return c
      })
      return { contracts, totals: calcTotals(contracts, state.transactions) }
    })
  }
})))
