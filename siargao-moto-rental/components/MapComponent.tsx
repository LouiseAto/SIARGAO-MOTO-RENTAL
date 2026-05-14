'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { formatCurrency } from '@/lib/utils/calculations'

interface Motorbike {
  id: string
  brand: string
  model: string
  plate_number: string
  status: string
  latitude: number
  longitude: number
  daily_rate: number
}

interface MapComponentProps {
  motorbikes: Motorbike[]
}

// Fix for default marker icons in Leaflet
const createCustomIcon = (status: string) => {
  const color =
    status === 'available' ? 'green' : status === 'rented' ? 'orange' : 'red'

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
      ">
        🏍️
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  })
}

export default function MapComponent({ motorbikes }: MapComponentProps) {
  // Center of Siargao (General Luna area)
  const center: [number, number] = [9.86, 126.05]

  useEffect(() => {
    // Fix for Leaflet icon paths
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/leaflet/marker-icon-2x.png',
      iconUrl: '/leaflet/marker-icon.png',
      shadowUrl: '/leaflet/marker-shadow.png',
    })
  }, [])

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%', borderRadius: '8px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {motorbikes.map((motorbike) => (
        <Marker
          key={motorbike.id}
          position={[motorbike.latitude, motorbike.longitude]}
          icon={createCustomIcon(motorbike.status)}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-lg mb-2">
                {motorbike.brand} {motorbike.model}
              </h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Plate:</span> {motorbike.plate_number}
                </p>
                <p>
                  <span className="font-medium">Daily Rate:</span>{' '}
                  {formatCurrency(motorbike.daily_rate)}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{' '}
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      motorbike.status === 'available'
                        ? 'bg-green-100 text-green-800'
                        : motorbike.status === 'rented'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {motorbike.status}
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  📍 {motorbike.latitude.toFixed(6)}, {motorbike.longitude.toFixed(6)}
                </p>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
