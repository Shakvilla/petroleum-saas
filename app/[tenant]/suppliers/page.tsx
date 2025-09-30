import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Phone, Mail, MapPin } from 'lucide-react';

export default async function SuppliersPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  return (
    <DashboardLayout tenant={tenant}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Supplier Management
            </h1>
            <p className="text-gray-600">
              Manage your petroleum suppliers and contracts
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Add Supplier
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: 'PetroSupply Co.',
              contact: 'John Anderson',
              phone: '+1 (555) 123-4567',
              email: 'john@petrosupply.com',
              location: 'Houston, TX',
              products: ['Premium Gasoline', 'Diesel'],
              status: 'Active',
            },
            {
              name: 'FuelMax Ltd.',
              contact: 'Sarah Johnson',
              phone: '+1 (555) 987-6543',
              email: 'sarah@fuelmax.com',
              location: 'Dallas, TX',
              products: ['Regular Gasoline', 'Heating Oil'],
              status: 'Active',
            },
            {
              name: 'Energy Solutions Inc.',
              contact: 'Mike Wilson',
              phone: '+1 (555) 456-7890',
              email: 'mike@energysolutions.com',
              location: 'Austin, TX',
              products: ['Jet Fuel', 'Kerosene'],
              status: 'Pending',
            },
          ].map((supplier, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    {supplier.name}
                  </CardTitle>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      supplier.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {supplier.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-500" />
                    {supplier.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-500" />
                    {supplier.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    {supplier.location}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Products:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {supplier.products.map((product, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                      >
                        {product}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                  >
                    Contact
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                  >
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
