'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Phone, Mail, Users, Globe } from 'lucide-react';
import type { CompanyProfileData } from '@/types/settings';

interface CompanyProfileSettingsProps {
  data: CompanyProfileData;
  validationErrors: Record<string, string[]>;
  onUpdate: (data: CompanyProfileData) => void;
}

export function CompanyProfileSettings({
  data,
  validationErrors,
  onUpdate,
}: CompanyProfileSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<CompanyProfileData>({
    defaultValues: data,
  });

  const watchedValues = watch();

  const onSubmit = (formData: CompanyProfileData) => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to original data
    Object.keys(data).forEach(key => {
      setValue(
        key as keyof CompanyProfileData,
        data[key as keyof CompanyProfileData]
      );
    });
  };

  const getFieldError = (fieldPath: string) => {
    return (
      validationErrors[fieldPath]?.[0] ||
      errors[fieldPath as keyof CompanyProfileData]?.message
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Company Profile
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your company's basic information and contact details
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isDirty && (
            <Badge
              variant="outline"
              className="text-amber-600 border-amber-200"
            >
              Unsaved changes
            </Badge>
          )}
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSubmit(onSubmit)}>Save Changes</Button>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Your company's primary identification and business details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  {...register('companyName', {
                    required: 'Company name is required',
                  })}
                  disabled={!isEditing}
                  className={
                    getFieldError('companyName') ? 'border-red-500' : ''
                  }
                />
                {getFieldError('companyName') && (
                  <p className="text-sm text-red-600">
                    {getFieldError('companyName')}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="legalName">Legal Name *</Label>
                <Input
                  id="legalName"
                  {...register('legalName', {
                    required: 'Legal name is required',
                  })}
                  disabled={!isEditing}
                  className={getFieldError('legalName') ? 'border-red-500' : ''}
                />
                {getFieldError('legalName') && (
                  <p className="text-sm text-red-600">
                    {getFieldError('legalName')}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <Input
                  id="industry"
                  {...register('industry', {
                    required: 'Industry is required',
                  })}
                  disabled={!isEditing}
                  className={getFieldError('industry') ? 'border-red-500' : ''}
                />
                {getFieldError('industry') && (
                  <p className="text-sm text-red-600">
                    {getFieldError('industry')}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type *</Label>
                <Select
                  value={watchedValues.businessType}
                  onValueChange={value =>
                    setValue('businessType', value as any)
                  }
                  disabled={!isEditing}
                >
                  <SelectTrigger
                    className={
                      getFieldError('businessType') ? 'border-red-500' : ''
                    }
                  >
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distributor">Distributor</SelectItem>
                    <SelectItem value="retailer">Retailer</SelectItem>
                    <SelectItem value="wholesaler">Wholesaler</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
                {getFieldError('businessType') && (
                  <p className="text-sm text-red-600">
                    {getFieldError('businessType')}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companySize">Company Size *</Label>
                <Select
                  value={watchedValues.companySize}
                  onValueChange={value => setValue('companySize', value as any)}
                  disabled={!isEditing}
                >
                  <SelectTrigger
                    className={
                      getFieldError('companySize') ? 'border-red-500' : ''
                    }
                  >
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">
                      Small (1-50 employees)
                    </SelectItem>
                    <SelectItem value="medium">
                      Medium (51-200 employees)
                    </SelectItem>
                    <SelectItem value="large">
                      Large (201-1000 employees)
                    </SelectItem>
                    <SelectItem value="enterprise">
                      Enterprise (1000+ employees)
                    </SelectItem>
                  </SelectContent>
                </Select>
                {getFieldError('companySize') && (
                  <p className="text-sm text-red-600">
                    {getFieldError('companySize')}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeCount">Employee Count *</Label>
                <Input
                  id="employeeCount"
                  type="number"
                  {...register('employeeCount', {
                    required: 'Employee count is required',
                    min: {
                      value: 0,
                      message: 'Employee count must be positive',
                    },
                  })}
                  disabled={!isEditing}
                  className={
                    getFieldError('employeeCount') ? 'border-red-500' : ''
                  }
                />
                {getFieldError('employeeCount') && (
                  <p className="text-sm text-red-600">
                    {getFieldError('employeeCount')}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Registration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Business Registration
            </CardTitle>
            <CardDescription>
              Official business registration and tax information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">
                  Registration Number *
                </Label>
                <Input
                  id="registrationNumber"
                  {...register('businessRegistration.registrationNumber', {
                    required: 'Registration number is required',
                  })}
                  disabled={!isEditing}
                  className={
                    getFieldError('businessRegistration.registrationNumber')
                      ? 'border-red-500'
                      : ''
                  }
                />
                {getFieldError('businessRegistration.registrationNumber') && (
                  <p className="text-sm text-red-600">
                    {getFieldError('businessRegistration.registrationNumber')}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID *</Label>
                <Input
                  id="taxId"
                  {...register('businessRegistration.taxId', {
                    required: 'Tax ID is required',
                  })}
                  disabled={!isEditing}
                  className={
                    getFieldError('businessRegistration.taxId')
                      ? 'border-red-500'
                      : ''
                  }
                />
                {getFieldError('businessRegistration.taxId') && (
                  <p className="text-sm text-red-600">
                    {getFieldError('businessRegistration.taxId')}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="incorporationDate">Incorporation Date *</Label>
                <Input
                  id="incorporationDate"
                  type="date"
                  {...register('businessRegistration.incorporationDate', {
                    required: 'Incorporation date is required',
                  })}
                  disabled={!isEditing}
                  className={
                    getFieldError('businessRegistration.incorporationDate')
                      ? 'border-red-500'
                      : ''
                  }
                />
                {getFieldError('businessRegistration.incorporationDate') && (
                  <p className="text-sm text-red-600">
                    {getFieldError('businessRegistration.incorporationDate')}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="jurisdiction">Jurisdiction *</Label>
                <Input
                  id="jurisdiction"
                  {...register('businessRegistration.jurisdiction', {
                    required: 'Jurisdiction is required',
                  })}
                  disabled={!isEditing}
                  className={
                    getFieldError('businessRegistration.jurisdiction')
                      ? 'border-red-500'
                      : ''
                  }
                />
                {getFieldError('businessRegistration.jurisdiction') && (
                  <p className="text-sm text-red-600">
                    {getFieldError('businessRegistration.jurisdiction')}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Primary Contact
            </CardTitle>
            <CardDescription>
              Main contact person and business address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Name *</Label>
                <Input
                  id="contactName"
                  {...register('primaryContact.name', {
                    required: 'Contact name is required',
                  })}
                  disabled={!isEditing}
                  className={
                    getFieldError('primaryContact.name') ? 'border-red-500' : ''
                  }
                />
                {getFieldError('primaryContact.name') && (
                  <p className="text-sm text-red-600">
                    {getFieldError('primaryContact.name')}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  {...register('primaryContact.email', {
                    required: 'Contact email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  disabled={!isEditing}
                  className={
                    getFieldError('primaryContact.email')
                      ? 'border-red-500'
                      : ''
                  }
                />
                {getFieldError('primaryContact.email') && (
                  <p className="text-sm text-red-600">
                    {getFieldError('primaryContact.email')}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone *</Label>
              <Input
                id="contactPhone"
                {...register('primaryContact.phone', {
                  required: 'Contact phone is required',
                })}
                disabled={!isEditing}
                className={
                  getFieldError('primaryContact.phone') ? 'border-red-500' : ''
                }
              />
              {getFieldError('primaryContact.phone') && (
                <p className="text-sm text-red-600">
                  {getFieldError('primaryContact.phone')}
                </p>
              )}
            </div>

            {/* Address Fields */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <Label className="text-sm font-medium">Business Address</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    {...register('primaryContact.address.street', {
                      required: 'Street address is required',
                    })}
                    disabled={!isEditing}
                    className={
                      getFieldError('primaryContact.address.street')
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {getFieldError('primaryContact.address.street') && (
                    <p className="text-sm text-red-600">
                      {getFieldError('primaryContact.address.street')}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    {...register('primaryContact.address.city', {
                      required: 'City is required',
                    })}
                    disabled={!isEditing}
                    className={
                      getFieldError('primaryContact.address.city')
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {getFieldError('primaryContact.address.city') && (
                    <p className="text-sm text-red-600">
                      {getFieldError('primaryContact.address.city')}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    {...register('primaryContact.address.state', {
                      required: 'State is required',
                    })}
                    disabled={!isEditing}
                    className={
                      getFieldError('primaryContact.address.state')
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {getFieldError('primaryContact.address.state') && (
                    <p className="text-sm text-red-600">
                      {getFieldError('primaryContact.address.state')}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    {...register('primaryContact.address.zipCode', {
                      required: 'ZIP code is required',
                    })}
                    disabled={!isEditing}
                    className={
                      getFieldError('primaryContact.address.zipCode')
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {getFieldError('primaryContact.address.zipCode') && (
                    <p className="text-sm text-red-600">
                      {getFieldError('primaryContact.address.zipCode')}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    {...register('primaryContact.address.country', {
                      required: 'Country is required',
                    })}
                    disabled={!isEditing}
                    className={
                      getFieldError('primaryContact.address.country')
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {getFieldError('primaryContact.address.country') && (
                    <p className="text-sm text-red-600">
                      {getFieldError('primaryContact.address.country')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Operational Regions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Operational Regions
            </CardTitle>
            <CardDescription>
              Geographic areas where your company operates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="operationalRegions">Operational Regions *</Label>
              <Textarea
                id="operationalRegions"
                placeholder="Enter regions separated by commas (e.g., Texas, Louisiana, Oklahoma)"
                {...register('operationalRegions', {
                  required: 'At least one operational region is required',
                })}
                disabled={!isEditing}
                className={
                  getFieldError('operationalRegions') ? 'border-red-500' : ''
                }
                rows={3}
              />
              {getFieldError('operationalRegions') && (
                <p className="text-sm text-red-600">
                  {getFieldError('operationalRegions')}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Separate multiple regions with commas
              </p>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
