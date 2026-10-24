import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import {
  Filter, TrendingUp, AlertTriangle, Layers,
} from 'lucide-react';
import { getIssues } from '../api/issues';
import type { Report, ReportStatus, ChallengeDomain } from '../api/types';
import { StatusPill } from '../components/StatusPill';

// Fix default Leaflet icon paths
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function getSeverityColor(report: Report): string {
  if (report.severity === 'CRITICAL') return '#DC2626';
  if (report.severity === 'HIGH') return '#F59E0B';
  if (report.severity === 'MEDIUM') return '#3B82F6';
  return '#10B981';
}

function createCustomPin(report: Report): L.DivIcon {
  const color = getSeverityColor(report);
  const score = Math.round(report.priorityScore || 0);

  const html = `
    <div style="position: relative; width: 32px; height: 42px; display: flex; flex-direction: column; align-items: center; cursor: pointer; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
      <div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 2px solid white;">
        <span style="transform: rotate(45deg); color: white; font-size: 11px; font-weight: bold; font-family: sans-serif;">${score}</span>
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-leaflet-pin',
    html,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  });
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const STATUS_OPTIONS: ReportStatus[] = [
  'SUBMITTED', 'ACKNOWLEDGED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED', 'DUPLICATE',
];
const DOMAIN_OPTIONS: ChallengeDomain[] = [
  'EDUCATION', 'HEALTHCARE', 'AGRICULTURE', 'WATER_RESOURCES', 'ENVIRONMENT',
  'ENERGY', 'URBAN_DEVELOPMENT', 'ACCESSIBILITY', 'PUBLIC_ADMINISTRATION', 'RURAL_LIVELIHOODS', 'OTHER',
];

export default function MapView() {
  const navigate = useNavigate();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ReportStatus | ''>('');
  const [domainFilter, setDomainFilter] = useState<ChallengeDomain | ''>('');

  // 1. Initialize Map instance safely without React-Leaflet double-mount issues
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // If map already exists, remove it first
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [23.3441, 85.3096], // Default center on Ranchi / Jharkhand
      zoom: 8,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const markerLayer = L.layerGroup().addTo(map);
    markerLayerRef.current = markerLayer;
    mapInstanceRef.current = map;

    // Clean up on component unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Fetch issues data
  useEffect(() => {
    setLoading(true);
    getIssues({
      status: statusFilter || undefined,
      domain: domainFilter || undefined,
    })
      .then((res) => {
        if (res && Array.isArray(res.reports)) {
          setReports(res.reports);
        } else {
          setReports([]);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch issues for map, showing empty state:', err);
        setReports([]);
      })
      .finally(() => setLoading(false));
  }, [statusFilter, domainFilter]);

  // 3. Update markers and fit bounds whenever reports change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markerLayer = markerLayerRef.current;
    if (!map || !markerLayer) return;

    markerLayer.clearLayers();

    const validReports = reports.filter(
      (r) => typeof r.latitude === 'number' && typeof r.longitude === 'number' && !isNaN(r.latitude) && !isNaN(r.longitude)
    );

    validReports.forEach((r) => {
      const pin = createCustomPin(r);
      const marker = L.marker([r.latitude, r.longitude], { icon: pin });

      const severityBadge = r.severity === 'CRITICAL' ? 'background: #FEE2E2; color: #991B1B;' :
        r.severity === 'HIGH' ? 'background: #FEF3C7; color: #92400E;' : 'background: #DBEAFE; color: #1E40AF;';

      const popupContent = `
        <div style="font-family: inherit; padding: 4px; min-width: 200px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 4px; ${severityBadge}">
              ${r.severity || 'PRIORITY'} ${Math.round(r.priorityScore || 0)}
            </span>
            <span style="font-size: 11px; font-weight: 600; padding: 2px 6px; border-radius: 4px; background: #F3F4F6; color: #374151;">
              ${r.status}
            </span>
          </div>
          <div style="font-weight: 700; font-size: 14px; color: #111827; margin-bottom: 4px;">
            ${(r.domain || 'Challenge').replace(/_/g, ' ')}
          </div>
          <p style="font-size: 12px; color: #4B5563; margin-bottom: 8px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${r.description || 'No description provided.'}
          </p>
          <p style="font-size: 11px; color: #6B7280; margin-bottom: 12px;">
            📍 ${r.address || `${r.latitude.toFixed(4)}, ${r.longitude.toFixed(4)}`}
          </p>
          <button id="view-details-${r.id}" style="width: 100%; font-size: 12px; font-weight: 600; color: white; background: #1D4ED8; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; transition: background 0.2s;">
            View Challenge Details →
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 280 });
      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-details-${r.id}`);
        if (btn) {
          btn.onclick = () => navigate(`/issues/${r.id}`);
        }
      });

      markerLayer.addLayer(marker);
    });

    if (validReports.length > 0) {
      const bounds = L.latLngBounds(validReports.map((r) => [r.latitude, r.longitude]));
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    } else {
      map.setView([23.3441, 85.3096], 8);
    }
  }, [reports, navigate]);

  // Live hotspot sidebar: take top 6 by priorityScore
  const hotspots = [...reports]
    .sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0))
    .slice(0, 6);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden relative">
      {/* Map area */}
      <div className="flex-1 relative h-full">
        {/* Filter bar overlay */}
        <div className="absolute top-4 left-4 z-[1000] flex items-center gap-2.5 bg-white/95 backdrop-blur-md border border-gray-200/80 rounded-xl px-3.5 py-2.5 shadow-lg">
          <Filter size={15} className="text-blue-600" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ReportStatus | '')}
            className="text-xs font-medium border-none outline-none bg-transparent text-gray-700 cursor-pointer pr-1"
          >
            <option value="">All Statuses ▾</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
            ))}
          </select>
          <div className="w-px h-4 bg-gray-200" />
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value as ChallengeDomain | '')}
            className="text-xs font-medium border-none outline-none bg-transparent text-gray-700 cursor-pointer pr-1"
          >
            <option value="">All Domains ▾</option>
            {DOMAIN_OPTIONS.map((d) => (
              <option key={d} value={d}>{d.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 z-[1000] bg-white/50 backdrop-blur-sm flex items-center justify-center">
            <div className="flex items-center gap-3 text-gray-700 font-medium text-sm bg-white px-5 py-3 rounded-2xl shadow-xl border border-gray-100">
              <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              Loading live map pins…
            </div>
          </div>
        )}

        {/* The DOM container where Leaflet binds */}
        <div ref={mapContainerRef} className="h-full w-full z-0" style={{ background: '#E5E7EB' }} />

        {/* Legend */}
        <div className="absolute bottom-6 left-6 z-[1000] bg-white/95 backdrop-blur-md rounded-xl border border-gray-200/80 px-4 py-3 shadow-lg text-xs min-w-[200px]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-gray-800">Priority Heatmap</span>
            <span className="text-[11px] font-semibold text-blue-600">{reports.length} Reports</span>
          </div>
          <div className="flex items-center gap-1.5 my-1.5">
            <div className="h-2 flex-1 rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-600" />
          </div>
          <div className="flex justify-between text-[10px] text-gray-500 font-medium mt-1">
            <span>Low (Score &lt;40)</span>
            <span>Critical (Score 80+)</span>
          </div>
        </div>
      </div>

      {/* Right sidebar: Live Hotspots */}
      <aside className="w-80 bg-white border-l border-gray-200 flex flex-col overflow-hidden shrink-0 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-blue-600" />
              <h2 className="text-sm font-bold text-gray-900">Priority Hotspots</h2>
            </div>
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-5 py-4 animate-pulse space-y-2">
                <div className="h-3.5 w-20 bg-gray-200 rounded" />
                <div className="h-4 w-48 bg-gray-200 rounded" />
                <div className="h-3 w-32 bg-gray-100 rounded" />
              </div>
            ))
          ) : hotspots.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <p className="text-sm">No reports match current filters</p>
            </div>
          ) : (
            hotspots.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  if (mapInstanceRef.current && typeof r.latitude === 'number' && typeof r.longitude === 'number') {
                    mapInstanceRef.current.flyTo([r.latitude, r.longitude], 14, { duration: 1.2 });
                  }
                }}
                className="w-full text-left px-5 py-4 hover:bg-blue-50/50 transition-colors group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      r.severity === 'CRITICAL'
                        ? 'bg-red-100 text-red-700'
                        : r.severity === 'HIGH'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {r.domain?.replace(/_/g, ' ') ?? 'General'}
                  </span>
                  <span className="text-[10px] text-gray-400">{formatRelativeTime(r.createdAt)}</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-700 transition-colors">
                  {r.description}
                </p>
                <p className="text-xs text-gray-500 truncate mb-2">
                  📍 {r.address ?? `${r.latitude.toFixed(3)}, ${r.longitude.toFixed(3)}`}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <TrendingUp size={13} className="text-gray-400" />
                    <span>Score: <strong className="text-gray-700">{Math.round(r.priorityScore || 0)}</strong></span>
                  </div>
                  <span className="text-xs font-semibold text-blue-600 group-hover:underline">Focus ➔</span>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={() => navigate('/issues')}
            className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white bg-blue-700 py-2.5 rounded-xl hover:bg-blue-800 transition-colors shadow-sm"
          >
            <AlertTriangle size={14} />
            View Issues Queue
          </button>
        </div>
      </aside>
    </div>
  );
}
