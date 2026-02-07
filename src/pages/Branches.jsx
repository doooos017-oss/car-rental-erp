import { useERP } from '../store/store.js'
import { useState } from 'react'

export default function Branches() {
  const { branches, cars, transferCar } = useERP()
  const [selection, setSelection] = useState({ carId: cars[0]?.id ?? 0, toBranchId: branches[0]?.id ?? 0 })
  const submit = () => transferCar(selection.carId, selection.toBranchId)
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">الفروع</h1>
      <div className="bg-gray-800 p-4 rounded-md space-y-3">
        <div className="text-lg">نقل سيارة</div>
        <select className="bg-gray-900 px-3 py-2 rounded-md" value={selection.carId} onChange={e => setSelection({ ...selection, carId: Number(e.target.value) })}>
          {cars.map(c => <option key={c.id} value={c.id}>{c.plate} ({branches.find(b => b.id === c.branchId)?.name})</option>)}
        </select>
        <select className="bg-gray-900 px-3 py-2 rounded-md" value={selection.toBranchId} onChange={e => setSelection({ ...selection, toBranchId: Number(e.target.value) })}>
          {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <button className="px-3 py-2 bg-indigo-600 rounded-md" onClick={submit}>نقل</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-3 py-2 text-right">الفرع</th>
              <th className="px-3 py-2 text-right">المدينة</th>
              <th className="px-3 py-2 text-right">السيارات</th>
            </tr>
          </thead>
          <tbody>
            {branches.map(b => (
              <tr key={b.id} className="border-b border-gray-800">
                <td className="px-3 py-2">{b.name}</td>
                <td className="px-3 py-2">{b.city}</td>
                <td className="px-3 py-2">{cars.filter(c => c.branchId === b.id).length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
