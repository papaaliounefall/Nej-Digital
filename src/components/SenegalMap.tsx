import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { RotateCcw } from 'lucide-react';

const DAKAR = { lat: 14.7167, lng: -17.4677 };

const SENEGAL_BOUNDS = L.latLngBounds([
  [12.2, -17.7], // South-West
  [16.7, -11.3]  // North-East
]);

type MapTileStyle = 'dark' | 'satellite' | 'streets';

function getTileConfig(style: MapTileStyle) {
  if (style === 'dark') {
    // Standard OSM tiles, inverted to a dark palette via CSS (no API key required)
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
      className: 'map-tiles-dark'
    };
  }
  if (style === 'satellite') {
    return {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Esri, Maxar, Earthstar Geographics',
      className: ''
    };
  }
  return {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    className: ''
  };
}

export const SenegalMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [tileStyle, setTileStyle] = useState<MapTileStyle>('dark');

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [14.4974, -14.4524],
      zoom: 7,
      minZoom: 6,
      maxZoom: 16,
      zoomControl: false,
      attributionControl: true
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    const initialTileConfig = getTileConfig('dark');
    tileLayerRef.current = L.tileLayer(initialTileConfig.url, {
      subdomains: 'abc',
      maxZoom: 19,
      className: initialTileConfig.className,
      attribution: initialTileConfig.attribution
    }).addTo(map);

    // Single marker — NEJ's operational base
    const dakarIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; inset: 0; border-radius: 50%; background: #3B82F6; opacity: 0.25; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="
            width: 20px;
            height: 20px;
            border-radius: 4px;
            background: #1D4ED8;
            border: 2px solid #93C5FD;
            box-shadow: 0 0 12px rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 8px;
            font-weight: bold;
          ">HQ</div>
          <div style="
            position: absolute;
            bottom: -18px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(10, 11, 14, 0.92);
            border: 1px solid #1F2937;
            padding: 1px 5px;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 9px;
            font-weight: 700;
            color: #E5E7EB;
            white-space: nowrap;
            pointer-events: none;
          ">Dakar</div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
    L.marker([DAKAR.lat, DAKAR.lng], { icon: dakarIcon }).addTo(map);

    mapInstanceRef.current = map;
    map.fitBounds(SENEGAL_BOUNDS, { padding: [20, 20] });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Style
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const config = getTileConfig(tileStyle);
    tileLayerRef.current = L.tileLayer(config.url, {
      subdomains: 'abc',
      maxZoom: 18,
      className: config.className,
      attribution: config.attribution
    }).addTo(mapInstanceRef.current);
  }, [tileStyle]);

  const handleResetView = () => {
    mapInstanceRef.current?.fitBounds(SENEGAL_BOUNDS, { padding: [20, 20] });
  };

  return (
    <div className="w-full flex flex-col bg-[#07090D] border border-[#1F2937] overflow-hidden text-left">

      {/* Map Top Control Bar */}
      <div className="p-3 bg-[#0A0B0E] border-b border-[#1F2937] flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-display font-bold text-white text-sm">
          Carte du Sénégal
        </span>

        <div className="flex items-center gap-2">
          {/* Tile Selector */}
          <div className="flex items-center bg-[#111827] p-0.5 border border-[#1F2937]">
            <button
              onClick={() => setTileStyle('dark')}
              className={`px-2 py-1 text-[10px] transition-colors ${
                tileStyle === 'dark' ? 'bg-[#3B82F6] text-white font-bold' : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              Sombre
            </button>
            <button
              onClick={() => setTileStyle('satellite')}
              className={`px-2 py-1 text-[10px] transition-colors ${
                tileStyle === 'satellite' ? 'bg-[#3B82F6] text-white font-bold' : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setTileStyle('streets')}
              className={`px-2 py-1 text-[10px] transition-colors ${
                tileStyle === 'streets' ? 'bg-[#3B82F6] text-white font-bold' : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              Rues
            </button>
          </div>

          {/* Reset Zoom */}
          <button
            onClick={handleResetView}
            className="p-1.5 bg-[#111827] hover:bg-[#1F2937] border border-[#1F2937] text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Vue globale du Sénégal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Leaflet Container */}
      <div className="relative w-full h-[360px] sm:h-[400px] z-0">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* Base Info */}
      <div className="p-4 bg-[#0A0B0E] border-t border-[#1F2937]">
        <div className="flex items-center gap-2">
          <span className="font-display font-black text-base sm:text-lg text-white">
            Dakar
          </span>
          <span className="text-[10px] px-2 py-0.5 bg-[#1F2937] text-[#3B82F6] border border-[#374151] font-bold uppercase tracking-wide">
            Siège opérationnel
          </span>
        </div>
        <p className="text-xs text-[#9CA3AF] mt-1">
          Notre équipe conçoit et déploie nos six produits depuis Dakar, au Sénégal.
        </p>
      </div>

    </div>
  );
};
