# Mock Company Setup - PetroMax Energy Solutions

## Overview

This document describes the complete mock company setup for the petroleum SaaS application, providing full access to all components and features for development and testing purposes.

## Company Details

### PetroMax Energy Solutions

- **ID**: `petromax-energy`
- **Name**: PetroMax Energy Solutions
- **Domain**: petromax-energy.com
- **Industry**: Petroleum & Energy Distribution
- **Location**: Houston, TX (Primary), Dallas, TX (Secondary)

### Business Profile

- **Primary Business**: Fuel distribution and storage
- **Services**: Gasoline, Diesel, Kerosene distribution
- **Fleet**: 2 active tanker trucks
- **Storage**: 3 main storage tanks
- **Operations**: 24/7 operations with 6-day work week

## Administrator Account

### Super Administrator

- **Name**: Sarah Johnson
- **Email**: admin@petromax-energy.com
- **Password**: admin123
- **Role**: ADMIN
- **Permissions**: Full access to all resources and actions

### Account Features

- Complete administrative privileges
- Access to all tenant features
- Ability to manage users, settings, and data
- Full API access
- Advanced analytics and reporting

## Infrastructure

### Storage Tanks

1. **Premium Gasoline Tank A**
   - Capacity: 50,000L
   - Current Level: 39,000L (78%)
   - Status: Active
   - Location: Main Distribution Center

2. **Diesel Tank B**
   - Capacity: 75,000L
   - Current Level: 45,000L (60%)
   - Status: Active
   - Location: Main Distribution Center

3. **Kerosene Tank C**
   - Capacity: 25,000L
   - Current Level: 8,000L (32%)
   - Status: Critical (Low Level Alert)
   - Location: Secondary Storage Facility

### Fleet Vehicles

1. **Tanker Truck Alpha**
   - Type: Tanker
   - Capacity: 10,000L
   - Status: Active
   - Driver: John Smith
   - Fuel Level: 85%

2. **Tanker Truck Beta**
   - Type: Tanker
   - Capacity: 12,000L
   - Status: Active
   - Driver: Mike Johnson
   - Fuel Level: 92%

### Business Metrics

- **Total Revenue**: $2,847,392
- **Fuel Inventory**: 92,000L
- **Active Deliveries**: 2
- **Daily Sales**: $156,847
- **Monthly Growth**: 12.5%
- **Customer Satisfaction**: 4.8/5

## Technical Implementation

### Files Created

1. **`lib/mock-company.ts`** - Company data and mock objects
2. **`lib/mock-auth.ts`** - Authentication mock data and functions
3. **`lib/mock-data-provider.ts`** - Data provider for all components
4. **`app/demo/page.tsx`** - Demo page showcasing all components

### API Integration

- **Tenant API**: `/api/tenants/petromax-energy`
- **Dashboard API**: `/api/tenants/petromax-energy/dashboard`
- **Authentication**: Mock login/logout functions
- **Data Provider**: Singleton pattern for consistent data

### Store Integration

- **Auth Store**: Pre-populated with admin user
- **Tenant Store**: Configured with company data
- **UI Store**: Default settings applied

## Component Access

### Dashboard Components

- ✅ ModernDashboardOverview
- ✅ ModernTankOverview
- ✅ ModernInventoryAlerts
- ✅ ModernInventoryHistory
- ✅ ModernIoTMonitoring
- ✅ ModernPredictiveAnalytics
- ✅ ModernSalesChart
- ✅ ModernTransactions

### Management Components

- ✅ InventoryManagement
- ✅ FleetTracker
- ✅ DistributionManagement
- ✅ RouteOptimizer

### Permission System

- ✅ ProtectedComponent
- ✅ FeatureGate
- ✅ PermissionGate
- ✅ All permission checks pass

## Usage Instructions

### 1. Access the Demo

Navigate to `/demo` to see the complete component showcase.

### 2. Login as Admin

- Click "Login as Admin" button
- Or use credentials: `admin@petromax-energy.com` / `admin123`

### 3. Explore Components

- **Dashboard**: Complete overview with all widgets
- **Inventory**: Tank management and alerts
- **Fleet**: Vehicle tracking and route optimization
- **Distribution**: Delivery management
- **Analytics**: Sales and predictive analytics
- **Permissions**: Permission system demonstration

### 4. Test Features

- All components are fully functional
- Real-time data updates
- Interactive elements work
- Permission gates demonstrate access control

## Data Structure

### Mock Data Includes

- **Tanks**: 3 storage tanks with realistic levels
- **Deliveries**: 2 active/scheduled deliveries
- **Vehicles**: 2 fleet vehicles with status
- **Transactions**: Recent sales and delivery transactions
- **Alerts**: System alerts and notifications
- **Analytics**: Performance metrics and trends

### Real-time Features

- Tank level monitoring
- Delivery status tracking
- Fleet location updates
- Alert notifications
- Performance metrics

## Development Benefits

### Complete Access

- No permission restrictions
- All features enabled
- Full administrative privileges
- Complete data visibility

### Realistic Data

- Industry-appropriate metrics
- Realistic business scenarios
- Proper data relationships
- Consistent naming conventions

### Testing Capabilities

- Component isolation testing
- Permission system testing
- Feature flag testing
- User experience testing

## Security Notes

### Development Only

- Mock data is for development/testing only
- No real authentication or authorization
- All permissions are granted by default
- Not suitable for production use

### Production Considerations

- Replace mock data with real API calls
- Implement proper authentication
- Add permission validation
- Secure data access patterns

## Maintenance

### Updating Mock Data

- Modify `lib/mock-company.ts` for company data
- Update `lib/mock-auth.ts` for user data
- Adjust `lib/mock-data-provider.ts` for component data

### Adding New Components

- Add to `app/demo/page.tsx`
- Include in appropriate tab
- Test with mock data
- Verify permission gates

## Conclusion

The PetroMax Energy Solutions mock company provides a complete, realistic environment for developing and testing the petroleum SaaS application. With full administrative access and comprehensive mock data, developers can test all components and features without restrictions.

This setup enables:

- Rapid component development
- Comprehensive testing
- User experience validation
- Permission system verification
- Feature demonstration

The mock company serves as a foundation for building a production-ready petroleum management system.
