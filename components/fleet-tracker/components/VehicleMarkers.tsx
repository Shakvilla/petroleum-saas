// Documentation: /docs/fleet-tracker/components/VehicleMarkers.md

/**
 * VehicleMarkers Component
 * 
 * Renders vehicle markers on the map with status indicators,
 * clustering, and interactive functionality.
 */

'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { Vehicle, VehicleStatus, VehicleType } from '../types';
import { cn } from '@/lib/utils';

export interface VehicleMarkersProps {
  map: mapboxgl.Map | null;
  vehicles: Vehicle[];
  selectedVehicleId?: string | null;
  enableClustering?: boolean;
  onVehicleClick?: (vehicle: Vehicle) => void;
  onVehicleHover?: (vehicle: Vehicle | null) => void;
  className?: string;
}

export interface VehicleMarkerState {
  markers: Map<string, mapboxgl.Marker>;
  clusters: any[];
  isUpdating: boolean;
}

const VehicleMarkers: React.FC<VehicleMarkersProps> = ({
  map,
  vehicles,
  selectedVehicleId,
  enableClustering = true,
  onVehicleClick,
  onVehicleHover,
  className,
}) => {
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const clustersRef = useRef<any[]>([]);
  const isUpdatingRef = useRef(false);

  // Vehicle status colors
  const getStatusColor = useCallback((status: VehicleStatus): string => {
    switch (status) {
      case 'active':
        return '#22c55e'; // green
      case 'inactive':
        return '#6b7280'; // gray
      case 'maintenance':
        return '#f59e0b'; // yellow
      case 'offline':
        return '#ef4444'; // red
      default:
        return '#6b7280';
    }
  }, []);

  // Vehicle type icons
  const getVehicleIcon = useCallback((type: VehicleType): string => {
    switch (type) {
      case 'truck':
        return '🚛';
      case 'van':
        return '🚐';
      case 'car':
        return '🚗';
      case 'motorcycle':
        return '🏍️';
      default:
        return '🚗';
    }
  }, []);

  // Create marker element
  const createMarkerElement = useCallback((vehicle: Vehicle): HTMLElement => {
    const isSelected = selectedVehicleId === vehicle.id;
    const statusColor = getStatusColor(vehicle.status);
    const vehicleIcon = getVehicleIcon(vehicle.vehicleType);
    
    const markerEl = document.createElement('div');
    markerEl.className = cn(
      'vehicle-marker flex items-center justify-center rounded-full border-2 shadow-lg cursor-pointer transition-all duration-200 hover:scale-110',
      isSelected ? 'ring-4 ring-blue-400' : ''
    );
    
    // Set marker size based on status
    const size = vehicle.status === 'active' ? 'w-8 h-8' : 'w-6 h-6';
    markerEl.className += ` ${size}`;
    
    // Set background color based on status
    markerEl.style.backgroundColor = statusColor;
    markerEl.style.borderColor = statusColor;
    
    // Add vehicle icon
    markerEl.innerHTML = `
      <span class="text-white text-xs font-bold">${vehicleIcon}</span>
    `;
    
    // Add tooltip
    markerEl.title = `${vehicle.name} - ${vehicle.status}`;
    
    return markerEl;
  }, [selectedVehicleId, getStatusColor, getVehicleIcon]);

  // Create popup content
  const createPopupContent = useCallback((vehicle: Vehicle): string => {
    const lastUpdate = new Date(vehicle.lastUpdate).toLocaleString();
    const speed = vehicle.position.speed > 0 ? `${vehicle.position.speed.toFixed(1)} km/h` : 'Stationary';
    
    return `
      <div class="p-3 min-w-[200px]">
        <div class="flex items-center space-x-2 mb-2">
          <span class="text-lg">${getVehicleIcon(vehicle.vehicleType)}</span>
          <div>
            <h3 class="font-semibold text-gray-900">${vehicle.name}</h3>
            <p class="text-sm text-gray-600">${vehicle.licensePlate}</p>
          </div>
        </div>
        
        <div class="space-y-1 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">Driver:</span>
            <span class="font-medium">${vehicle.driver.name}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Status:</span>
            <span class="font-medium capitalize" style="color: ${getStatusColor(vehicle.status)}">${vehicle.status}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Speed:</span>
            <span class="font-medium">${speed}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Last Update:</span>
            <span class="font-medium">${lastUpdate}</span>
          </div>
          ${vehicle.fuelLevel !== undefined ? `
            <div class="flex justify-between">
              <span class="text-gray-600">Fuel:</span>
              <span class="font-medium">${vehicle.fuelLevel.toFixed(1)}%</span>
            </div>
          ` : ''}
        </div>
        
        <div class="mt-3 pt-2 border-t border-gray-200">
          <button 
            class="w-full px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
            onclick="window.selectVehicle('${vehicle.id}')"
          >
            View Details
          </button>
        </div>
      </div>
    `;
  }, [getVehicleIcon, getStatusColor]);

  // Update markers
  const updateMarkers = useCallback(() => {
    if (!map || isUpdatingRef.current) return;
    
    isUpdatingRef.current = true;
    
    // Remove existing markers
    markersRef.current.forEach(marker => {
      marker.remove();
    });
    markersRef.current.clear();
    
    // Add new markers
    vehicles.forEach(vehicle => {
      const markerEl = createMarkerElement(vehicle);
      const popupContent = createPopupContent(vehicle);
      
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false,
      }).setHTML(popupContent);
      
      const marker = new mapboxgl.Marker({
        element: markerEl,
        anchor: 'center',
      })
        .setLngLat([vehicle.position.lng, vehicle.position.lat])
        .setPopup(popup)
        .addTo(map);
      
      // Add click handler
      markerEl.addEventListener('click', (e) => {
        e.stopPropagation();
        onVehicleClick?.(vehicle);
      });
      
      // Add hover handlers
      markerEl.addEventListener('mouseenter', () => {
        onVehicleHover?.(vehicle);
      });
      
      markerEl.addEventListener('mouseleave', () => {
        onVehicleHover?.(null);
      });
      
      markersRef.current.set(vehicle.id, marker);
    });
    
    isUpdatingRef.current = false;
  }, [map, vehicles, createMarkerElement, createPopupContent, onVehicleClick, onVehicleHover]);

  // Update markers when vehicles change
  useEffect(() => {
    updateMarkers();
  }, [updateMarkers]);

  // Update selected vehicle marker
  useEffect(() => {
    if (!map) return;
    
    markersRef.current.forEach((marker, vehicleId) => {
      const markerEl = marker.getElement();
      const isSelected = selectedVehicleId === vehicleId;
      
      if (isSelected) {
        markerEl.classList.add('ring-4', 'ring-blue-400');
        markerEl.classList.remove('ring-0');
      } else {
        markerEl.classList.remove('ring-4', 'ring-blue-400');
        markerEl.classList.add('ring-0');
      }
    });
  }, [selectedVehicleId, map]);

  // Cleanup markers on unmount
  useEffect(() => {
    return () => {
      markersRef.current.forEach(marker => {
        marker.remove();
      });
      markersRef.current.clear();
    };
  }, []);

  // Expose methods for external control
  React.useImperativeHandle(React.forwardRef(() => null), () => ({
    updateMarkers,
    getMarkers: () => markersRef.current,
    getMarker: (vehicleId: string) => markersRef.current.get(vehicleId),
  }));

  return null; // This component doesn't render anything visible
};

export default VehicleMarkers;
