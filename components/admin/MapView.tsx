'use client'
import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { format, parseISO } from 'date-fns'

// Fix Leaflet default icons (webpack issue)
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
  })
}

const SERVICE_COLORS: Record<string, string> = {
  domestic: '#0d9488',
  commercial_level3: '#2563eb',
  commercial_level4: '#1d4ed8',
  commercial_tm44: '#7c3aed',
  commercial_dec: '#d97706',
  on_construction_design: '#16a34a',
  air_tightness_domestic: '#ea580c'
}

function createColoredIcon(color: string, isSelected: boolean) {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width: ${isSelected ? 20 : 14}px;
        height: ${isSelected ? 20 : 14}px;
        border-radius: 50%;
        background: ${color};
        border: 2px solid ${isSelected ? '#fff' : 'rgba(255,255,255,0.6)'};
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transition: all 0.2s;
      "></div>
    `,
    iconSize: [isSelected ? 20 : 14, isSelected ? 20 : 14],
    iconAnchor: [isSelected ? 10 : 7, isSelected ? 10 : 7]
  })
}

interface MapViewProps {
  jobs: any[]
  selectedJobId: string | null
  onSelectJob: (id: string | null) => void
}

export default function MapView({ jobs, selectedJobId, onSelectJob }: MapViewProps) {
  // Filter jobs that have coordinates
  const mappableJobs = jobs.filter(j => {
    const lat = j.bookings?.properties?.latitude
    const lng = j.bookings?.properties?.longitude
    return lat && lng
  })

  // London fallback center
  const center: [number, number] = [51.5074, -0.1278]

  // Group jobs by assessor for route lines
  const byAssessor: Record<string, any[]> = {}
  mappableJobs.forEach(j => {
    const aId = j.assessors?.full_name || 'unknown'
    if (!byAssessor[aId]) byAssessor[aId] = []
    byAssessor[aId].push(j)
  })

  const assessorColors = ['#0d9488', '#2563eb', '#7c3aed', '#d97706', '#ea580c', '#16a34a']

  return (
    <MapContainer
      center={center}
      zoom={10}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Draw route lines per assessor */}
      {Object.entries(byAssessor).map(([name, aJobs], i) => {
        const sorted = [...aJobs].sort((a, b) => a.start_datetime < b.start_datetime ? -1 : 1)
        const positions: [number, number][] = sorted.map(j => [
          j.bookings?.properties?.latitude,
          j.bookings?.properties?.longitude
        ])
        if (positions.length < 2) return null
        return (
          <Polyline
            key={name}
            positions={positions}
            color={assessorColors[i % assessorColors.length]}
            weight={2}
            opacity={0.5}
            dashArray="6,4"
          />
        )
      })}

      {/* Markers */}
      {mappableJobs.map(job => {
        const lat = job.bookings?.properties?.latitude
        const lng = job.bookings?.properties?.longitude
        const isSelected = selectedJobId === job.id
        const serviceType = job.bookings?.service_type || 'domestic'
        const color = SERVICE_COLORS[serviceType] || '#6b7280'

        return (
          <Marker
            key={job.id}
            position={[lat, lng]}
            icon={createColoredIcon(color, isSelected)}
            eventHandlers={{ click: () => onSelectJob(isSelected ? null : job.id) }}
          >
            <Popup>
              <div style={{ minWidth: 180, fontFamily: 'system-ui, sans-serif' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 4 }}>
                  {job.bookings?.booking_ref}
                </div>
                <div style={{ fontSize: '0.8rem', marginBottom: 4, color: '#374151' }}>
                  {job.bookings?.properties?.address_line_1}, {job.bookings?.properties?.postcode}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  {format(parseISO(job.start_datetime), 'HH:mm')} · {serviceType.replace(/_/g, ' ')}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  👷 {job.assessors?.full_name || 'Unassigned'}
                </div>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}
