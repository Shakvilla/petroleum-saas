'use client';

import React from 'react';
import {
  Fuel,
  BarChart3,
  Truck,
  Users,
  Shield,
  Globe,
  Zap,
  TrendingUp,
  Building2,
  Wrench,
} from 'lucide-react';

const VisualMarketingSection: React.FC = () => {
  return (
    <div className="relative w-full h-full p-12 flex flex-col justify-center">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Abstract Geometric Shapes */}
        <div className="absolute top-20 left-20 w-16 h-16 bg-pink-400 rounded-lg transform rotate-12 opacity-80"></div>
        <div className="absolute top-32 right-32 w-12 h-12 bg-yellow-400 rounded-full opacity-70"></div>
        <div className="absolute top-48 left-1/3 w-20 h-8 bg-green-400 rounded-full opacity-60"></div>
        <div className="absolute bottom-32 right-20 w-14 h-14 bg-blue-400 rounded-lg transform -rotate-12 opacity-75"></div>
        <div className="absolute bottom-48 left-1/4 w-10 h-10 bg-orange-400 rounded-full opacity-65"></div>
        <div className="absolute top-1/3 right-1/4 w-18 h-6 bg-purple-400 rounded-full opacity-55"></div>

        {/* 3D Equipment Elements */}
        <div className="absolute top-1/4 right-1/3 w-24 h-16 bg-gray-800 rounded-lg shadow-lg transform rotate-6">
          <div className="w-full h-2 bg-gray-600 rounded-t-lg"></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full absolute top-2 right-2"></div>
        </div>

        <div className="absolute bottom-1/3 left-1/5 w-20 h-20 bg-gray-700 rounded-full shadow-lg">
          <div className="w-12 h-12 bg-gray-600 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Main Heading */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Streamline Your Petroleum
          <span className="text-blue-600"> Operations</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-600 mb-8 max-w-md">
          Complete management solution for petroleum distribution companies.
          Track inventory, manage deliveries, and optimize operations.
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 gap-6 max-w-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Fuel className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              Inventory Management
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Truck className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              Fleet Tracking
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Analytics</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              Compliance
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-3 gap-8 max-w-md">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">500+</div>
            <div className="text-sm text-gray-600">Companies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">50K+</div>
            <div className="text-sm text-gray-600">Tanks Managed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">99.9%</div>
            <div className="text-sm text-gray-600">Uptime</div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-8 h-8 bg-yellow-300 rounded-full animate-pulse"></div>
      <div className="absolute bottom-40 left-16 w-6 h-6 bg-pink-300 rounded-full animate-bounce"></div>
      <div className="absolute top-1/2 right-16 w-4 h-4 bg-blue-300 rounded-full animate-ping"></div>
    </div>
  );
};

export default VisualMarketingSection;
