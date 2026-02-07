import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useERP } from '../store/store.js'

export default function GPS() {
  const { cars } = useERP()
  const center = [24.7136, 46.6753]
  const statusMap = { 'Available': 'متاح', 'Rented': 'مؤجر', 'Maintenance': 'صيانة' }
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">تتبع GPS</h1>
      <div className="h-[600px] rounded-md overflow-hidden">
        <MapContainer center={center} zoom={6} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {cars.map(c => (
            <Marker key={c.id} position={[c.lat, c.lng]}>
              <Popup>
                <div className="text-sm text-right" dir="rtl">
                  <div className="font-bold">{c.plate}</div>
                  <div>{c.model}</div>
                  <div>{statusMap[c.status] || c.status}</div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
