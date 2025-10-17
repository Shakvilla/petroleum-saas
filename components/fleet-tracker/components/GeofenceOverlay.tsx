// Documentation: /docs/fleet-tracker/components/GeofenceOverlay.md

/**
 * GeofenceOverlay Component
 * 
 * Renders geofence polygons and circles on the map with
 * visual styling and interactive functionality.
 */

'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { Geofence } from '../types';
import { cn } from '@/lib/utils';

export interface GeofenceOverlayProps {
  map: mapboxgl.Map | null;
  geofences: Geofence[];
  selectedGeofenceId?: string | null;
  onGeofenceClick?: (geofence: Geofence) => void;
  onGeofenceHover?: (geofence: Geofence | null) => void;
  className?: string;
}

export interface GeofenceOverlayState {
  sources: Map<string, any>;
  layers: Map<string, any>;
  isUpdating: boolean;
}

const GeofenceOverlay: React.FC<GeofenceOverlayProps> = ({
  map,
  geofences,
  selectedGeofenceId,
  onGeofenceClick,
  onGeofenceHover,
  className,
}) => {
  const sourcesRef = useRef<Map<string, any>>(new Map());
  const layersRef = useRef<Map<string, any>>(new Map());
  const isUpdatingRef = useRef(false);

  // Convert geofence to GeoJSON
  const geofenceToGeoJSON = useCallback((geofence: Geofence): any => {
    if (geofence.geometry.type === 'Circle') {
      // Convert circle to polygon approximation
      const center = geofence.geometry.coordinates[0];
      const radius = geofence.geometry.radius || 1000; // meters
      const points = 32; // Number of points in the circle
      const coordinates: number[][] = [];
      
      for (let i = 0; i < points; i++) {
        const angle = (i * 360) / points;
        const lat = center[0] + (radius / 111000) * Math.cos(angle * Math.PI / 180);
        const lng = center[1] + (radius / 111000) * Math.sin(angle * Math.PI / 180);
        coordinates.push([lng, lat]);
      }
      
      // Close the polygon
      coordinates.push(coordinates[0]);
      
      return {
        type: 'Feature',
        id: geofence.id,
        properties: {
          id: geofence.id,
          name: geofence.name,
          type: geofence.type,
          color: geofence.color,
          isActive: geofence.isActive,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [coordinates],
        },
      };
    } else {
      // Polygon geofence
      return {
        type: 'Feature',
        id: geofence.id,
        properties: {
          id: geofence.id,
          name: geofence.name,
          type: geofence.type,
          color: geofence.color,
          isActive: geofence.isActive,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [geofence.geometry.coordinates.map(coord => [coord[1], coord[0]])], // Convert lat,lng to lng,lat
        },
      };
    }
  }, []);

  // Get geofence style
  const getGeofenceStyle = useCallback((geofence: Geofence) => {
    const baseColor = geofence.color || '#3b82f6';
    const opacity = geofence.isActive ? 0.3 : 0.1;
    
    return {
      fillColor: baseColor,
      fillOpacity: opacity,
      strokeColor: baseColor,
      strokeOpacity: geofence.isActive ? 0.8 : 0.4,
      strokeWidth: geofence.isActive ? 2 : 1,
    };
  }, []);

  // Update geofence layers
  const updateGeofences = useCallback(() => {
    if (!map || isUpdatingRef.current) return;
    
    isUpdatingRef.current = true;
    
    // Remove existing sources and layers
    layersRef.current.forEach((layer, layerId) => {
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
    });
    layersRef.current.clear();
    
    sourcesRef.current.forEach((source, sourceId) => {
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
    });
    sourcesRef.current.clear();
    
    if (geofences.length === 0) {
      isUpdatingRef.current = false;
      return;
    }
    
    // Create GeoJSON features
    const features = geofences.map(geofenceToGeoJSON);
    
    // Add source
    const sourceId = 'geofences-source';
    map.addSource(sourceId, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features,
      },
    });
    sourcesRef.current.set(sourceId, { type: 'geojson', data: { type: 'FeatureCollection', features } });
    
    // Add fill layer
    const fillLayerId = 'geofences-fill';
    map.addLayer({
      id: fillLayerId,
      type: 'fill',
      source: sourceId,
      paint: {
        'fill-color': [
          'case',
          ['get', 'isActive'],
          ['get', 'color'],
          ['get', 'color']
        ],
        'fill-opacity': [
          'case',
          ['get', 'isActive'],
          0.3,
          0.1
        ],
      },
    });
    layersRef.current.set(fillLayerId, { type: 'fill', source: sourceId });
    
    // Add stroke layer
    const strokeLayerId = 'geofences-stroke';
    map.addLayer({
      id: strokeLayerId,
      type: 'line',
      source: sourceId,
      paint: {
        'line-color': [
          'case',
          ['get', 'isActive'],
          ['get', 'color'],
          ['get', 'color']
        ],
        'line-opacity': [
          'case',
          ['get', 'isActive'],
          0.8,
          0.4
        ],
        'line-width': [
          'case',
          ['get', 'isActive'],
          2,
          1
        ],
      },
    });
    layersRef.current.set(strokeLayerId, { type: 'line', source: sourceId });
    
    // Add click handler
    map.on('click', fillLayerId, (e) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        const geofence = geofences.find(g => g.id === feature.properties?.id);
        if (geofence) {
          onGeofenceClick?.(geofence);
        }
      }
    });
    
    // Add hover handler
    map.on('mouseenter', fillLayerId, () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    
    map.on('mouseleave', fillLayerId, () => {
      map.getCanvas().style.cursor = '';
      onGeofenceHover?.(null);
    });
    
    isUpdatingRef.current = false;
  }, [map, geofences, geofenceToGeoJSON, onGeofenceClick, onGeofenceHover]);

  // Update geofences when data changes
  useEffect(() => {
    updateGeofences();
  }, [updateGeofences]);

  // Update selected geofence styling
  useEffect(() => {
    if (!map || !selectedGeofenceId) return;
    
    // Update layer styling for selected geofence
    const fillLayerId = 'geofences-fill';
    const strokeLayerId = 'geofences-stroke';
    
    if (map.getLayer(fillLayerId)) {
      map.setPaintProperty(fillLayerId, 'fill-opacity', [
        'case',
        ['==', ['get', 'id'], selectedGeofenceId],
        0.5,
        [
          'case',
          ['get', 'isActive'],
          0.3,
          0.1
        ]
      ]);
    }
    
    if (map.getLayer(strokeLayerId)) {
      map.setPaintProperty(strokeLayerId, 'line-width', [
        'case',
        ['==', ['get', 'id'], selectedGeofenceId],
        3,
        [
          'case',
          ['get', 'isActive'],
          2,
          1
        ]
      ]);
    }
  }, [selectedGeofenceId, map]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (map) {
        layersRef.current.forEach((layer, layerId) => {
          if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
          }
        });
        sourcesRef.current.forEach((source, sourceId) => {
          if (map.getSource(sourceId)) {
            map.removeSource(sourceId);
          }
        });
      }
    };
  }, [map]);

  // Expose methods for external control
  React.useImperativeHandle(React.forwardRef(() => null), () => ({
    updateGeofences,
    getSources: () => sourcesRef.current,
    getLayers: () => layersRef.current,
  }));

  return null; // This component doesn't render anything visible
};

export default GeofenceOverlay;
