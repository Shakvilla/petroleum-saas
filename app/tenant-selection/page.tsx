'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Search,
  ArrowRight,
  Globe,
  Users,
  Shield,
} from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  plan: string;
  description: string;
  logo?: string;
  isActive: boolean;
}

export default function TenantSelectionPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);

  // Mock tenant data - in real app, this would come from an API
  const tenants: Tenant[] = [
    {
      id: 'demo-tenant',
      name: 'Demo Petroleum Co.',
      plan: 'premium',
      description: 'Full-featured demo environment with all capabilities',
      isActive: true,
    },
    {
      id: 'acme-fuels',
      name: 'ACME Fuels',
      plan: 'standard',
      description: 'Regional fuel distributor with 50+ locations',
      isActive: true,
    },
    {
      id: 'metro-gas',
      name: 'Metro Gas & Oil',
      plan: 'enterprise',
      description: 'Large-scale petroleum operations with advanced analytics',
      isActive: true,
    },
    {
      id: 'test-tenant',
      name: 'Test Environment',
      plan: 'basic',
      description: 'Development and testing environment',
      isActive: false,
    },
  ];

  const filteredTenants = tenants.filter(
    tenant =>
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTenantSelect = (tenantId: string) => {
    setSelectedTenant(tenantId);
  };

  const handleContinue = () => {
    if (selectedTenant) {
      // Redirect to tenant-specific dashboard
      router.push(`/${selectedTenant}`);
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic':
        return 'bg-gray-100 text-gray-800';
      case 'standard':
        return 'bg-blue-100 text-blue-800';
      case 'premium':
        return 'bg-purple-100 text-purple-800';
      case 'enterprise':
        return 'bg-gold-100 text-gold-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">
              Petroleum Manager
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select your organization to access your petroleum management
            dashboard
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tenant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
          {filteredTenants.map(tenant => (
            <Card
              key={tenant.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedTenant === tenant.id
                  ? 'ring-2 ring-blue-500 bg-blue-50'
                  : 'hover:shadow-md'
              } ${!tenant.isActive ? 'opacity-60' : ''}`}
              onClick={() => tenant.isActive && handleTenantSelect(tenant.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{tenant.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {tenant.id}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getPlanColor(tenant.plan)}>
                    {tenant.plan}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  {tenant.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Globe className="h-3 w-3 mr-1" />
                      <span>Multi-tenant</span>
                    </div>
                    <div className="flex items-center">
                      <Shield className="h-3 w-3 mr-1" />
                      <span>Secure</span>
                    </div>
                  </div>
                  {selectedTenant === tenant.id && (
                    <ArrowRight className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                {!tenant.isActive && (
                  <div className="mt-2">
                    <Badge
                      variant="outline"
                      className="text-orange-600 border-orange-200"
                    >
                      Inactive
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No results */}
        {filteredTenants.length === 0 && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No organizations found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search terms or contact your administrator.
            </p>
          </div>
        )}

        {/* Continue Button */}
        {selectedTenant && (
          <div className="text-center">
            <Button
              onClick={handleContinue}
              size="lg"
              className="px-8 py-3 text-lg"
            >
              Continue to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>
            Need help? Contact your system administrator or{' '}
            <a href="/support" className="text-blue-600 hover:underline">
              visit our support center
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
