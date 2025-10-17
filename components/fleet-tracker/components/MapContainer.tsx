// Documentation: /docs/fleet-tracker/components/MapContainer.md

/**
 * MapContainer Component
 * 
 * Core map rendering component using Mapbox GL JS.
 * Provides interactive map functionality with proper lifecycle management.
 */

'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapViewport, Vehicle, Geofence } from '../types';
import { cn } from '@/lib/utils';

// Import Mapbox CSS
import 'mapbox-gl/dist/mapbox-gl.css';

export interface MapContainerProps {
  // Map Configuration
  accessToken: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  mapStyle?: string;
  
  // Data
  vehicles?: Vehicle[];
  geofences?: Geofence[];
  
  // Event Handlers
  onMapLoad?: (map: mapboxgl.Map) => void;
  onViewportChange?: (viewport: MapViewport) => void;
  onVehicleClick?: (vehicle: Vehicle) => void;
  onGeofenceClick?: (geofence: Geofence) => void;
  
  // Styling
  className?: string;
  height?: string | number;
  
  // Features
  enableControls?: boolean;
  enableClustering?: boolean;
  enableGeofences?: boolean;
}

export interface MapContainerState {
  map: mapboxgl.Map | null;
  isLoaded: boolean;
  error: string | null;
  viewport: MapViewport;
}

const MapContainer: React.FC<MapContainerProps> = ({
  accessToken,
  initialCenter = [0, 0],
  initialZoom = 2,
  mapStyle = 'mapbox://styles/mapbox/streets-v12',
  vehicles = [],
  geofences = [],
  onMapLoad,
  onViewportChange,
  onVehicleClick,
  onGeofenceClick,
  className,
  height = '100%',
  enableControls = true,
  enableClustering = true,
  enableGeofences = true,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [state, setState] = useState<MapContainerState>({
    map: null,
    isLoaded: false,
    error: null,
    viewport: {
      center: initialCenter,
      zoom: initialZoom,
      bearing: 0,
      pitch: 0,
    },
  });

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      // Set Mapbox access token
      mapboxgl.accessToken = accessToken;

      // Create map instance
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: initialCenter,
        zoom: initialZoom,
        bearing: 0,
        pitch: 0,
        antialias: true,
        attributionControl: false,
      });

      // Add map event listeners
      map.current.on('load', () => {
        setState(prev => ({
          ...prev,
          isLoaded: true,
          map: map.current,
        }));
        onMapLoad?.(map.current!);
      });

      map.current.on('error', (e) => {
        setState(prev => ({
          ...prev,
          error: `Map error: ${e.error?.message || 'Unknown error'}`,
        }));
      });

      map.current.on('moveend', () => {
        if (map.current) {
          const center = map.current.getCenter();
          const zoom = map.current.getZoom();
          const bearing = map.current.getBearing();
          const pitch = map.current.getPitch();

          const viewport: MapViewport = {
            center: [center.lng, center.lat],
            zoom,
            bearing,
            pitch,
          };

          setState(prev => ({
            ...prev,
            viewport,
          }));

          onViewportChange?.(viewport);
        }
      });

      // Add navigation controls
      if (enableControls) {
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');
      }

      // Add attribution
      map.current.addControl(new mapboxgl.AttributionControl({
        compact: true,
      }), 'bottom-right');

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: `Failed to initialize map: ${error}`,
      }));
    }

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [accessToken, mapStyle, initialCenter, initialZoom, enableControls, onMapLoad, onViewportChange]);

  // Update map style
  useEffect(() => {
    if (map.current && map.current.isStyleLoaded()) {
      map.current.setStyle(mapStyle);
    }
  }, [mapStyle]);

  // Update viewport
  const updateViewport = useCallback((newViewport: Partial<MapViewport>) => {
    if (!map.current) return;

    const { center, zoom, bearing, pitch } = newViewport;

    if (center) {
      map.current.setCenter(center);
    }
    if (zoom !== undefined) {
      map.current.setZoom(zoom);
    }
    if (bearing !== undefined) {
      map.current.setBearing(bearing);
    }
    if (pitch !== undefined) {
      map.current.setPitch(pitch);
    }
  }, []);

  // Fit map to bounds
  const fitBounds = useCallback((bounds: mapboxgl.LngLatBoundsLike, options?: mapboxgl.FitBoundsOptions) => {
    if (!map.current) return;

    map.current.fitBounds(bounds, {
      padding: 50,
      maxZoom: 15,
      ...options,
    });
  }, []);

  // Fly to location
  const flyTo = useCallback((center: [number, number], zoom?: number, options?: mapboxgl.AnimationOptions) => {
    if (!map.current) return;

    map.current.flyTo({
      center,
      zoom: zoom || map.current.getZoom(),
      ...options,
    });
  }, []);

  // Get map instance
  const getMap = useCallback(() => {
    return map.current;
  }, []);

  // Expose methods via ref
  React.useImperativeHandle(React.forwardRef(() => null), () => ({
    updateViewport,
    fitBounds,
    flyTo,
    getMap,
  }));

  // Error state
  if (state.error) {
    return (
      <div className={cn('flex items-center justify-center bg-gray-100 rounded-lg', className)} style={{ height }}>
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Map Error</h3>
          <p className="text-gray-600 mb-4">{state.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (!state.isLoaded) {
    return (
      <div className={cn('flex items-center justify-center bg-gray-100 rounded-lg', className)} style={{ height }}>
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Map</h3>
          <p className="text-gray-600">Initializing map components...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)} style={{ height }}>
      {/* Map Container */}
      <div
        ref={mapContainer}
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ height }}
      />
      
      {/* Map Overlay Controls */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-white rounded-lg shadow-lg p-2 space-y-2">
          {/* Vehicle Count */}
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">{vehicles.length} vehicles</span>
          </div>
          
          {/* Geofence Count */}
          {enableGeofences && (
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">{geofences.length} geofences</span>
            </div>
          )}
        </div>
      </div>

      {/* Map Info */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-2 text-xs text-gray-600">
          <div>Zoom: {state.viewport.zoom.toFixed(1)}</div>
          <div>Center: {state.viewport.center[1].toFixed(4)}, {state.viewport.center[0].toFixed(4)}</div>
        </div>
      </div>
    </div>
  );
};

export default MapContainer;
