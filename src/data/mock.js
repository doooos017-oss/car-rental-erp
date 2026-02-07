export const initialData = {
  branches: [
    { id: 1, name: 'Central', city: 'Riyadh' },
    { id: 2, name: 'West', city: 'Jeddah' },
    { id: 3, name: 'East', city: 'Dammam' }
  ],
  cars: [
    { id: 100, plate: 'ABC-1234', model: 'Toyota Camry 2023', status: 'Available', branchId: 1, lat: 24.7136, lng: 46.6753 },
    { id: 101, plate: 'DEF-5678', model: 'Hyundai Elantra 2022', status: 'Maintenance', branchId: 2, lat: 21.4858, lng: 39.1925 },
    { id: 102, plate: 'GHI-9012', model: 'Kia Sportage 2024', status: 'Rented', branchId: 3, lat: 26.3927, lng: 49.9777 }
  ],
  customers: [
    { id: 200, name: 'Ahmed Ali', nationalId: '1010101010', docUrl: '', phone: '+966500000001' },
    { id: 201, name: 'Sara Khan', nationalId: '2020202020', docUrl: '', phone: '+966500000002' }
  ],
  contracts: [
    { id: 300, customerId: 200, carId: 102, startDate: '2026-02-01', endDate: '2026-02-10', dailyRate: 180, vat: 0.15, total: 1800, status: 'Active' }
  ],
  tasks: [
    { id: 400, title: 'Cleaning', type: 'Cleaning', carId: 101, employeeId: 900, status: 'Todo' },
    { id: 401, title: 'Maintenance Check', type: 'Maintenance', carId: 101, employeeId: 901, status: 'In Progress' }
  ],
  transactions: [
    { id: 500, type: 'invoice', status: 'pending', amount: 1800, vat: 270, date: '2026-02-01', contractId: 300 },
    { id: 501, type: 'payment', status: 'paid', amount: 900, vat: 0, date: '2026-02-03', contractId: 300 }
  ],
  transfers: [
    { id: 600, carId: 100, toBranchId: 2, date: '2026-01-15' }
  ],
  employees: [
    { id: 900, name: 'محمد الفهد', role: 'عامل نظافة', branchId: 1 },
    { id: 901, name: 'خالد السالم', role: 'فني صيانة', branchId: 1 },
    { id: 902, name: 'عمر اليوسف', role: 'موظف استقبال', branchId: 2 }
  ]
}
