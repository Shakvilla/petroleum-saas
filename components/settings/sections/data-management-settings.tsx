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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Trash2,
  Database,
  Shield,
  Download,
  Archive,
} from 'lucide-react';
import type { DataManagementSettingsData } from '@/types/settings';

interface DataManagementSettingsProps {
  data: DataManagementSettingsData;
  validationErrors: Record<string, string[]>;
  onUpdate: (data: DataManagementSettingsData) => void;
}

export function DataManagementSettings({
  data,
  validationErrors,
  onUpdate,
}: DataManagementSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<DataManagementSettingsData>({
    defaultValues: data,
  });

  const watchedValues = watch();

  const onSubmit = (formData: DataManagementSettingsData) => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    Object.keys(data).forEach(key => {
      setValue(
        key as keyof DataManagementSettingsData,
        data[key as keyof DataManagementSettingsData]
      );
    });
  };

  const getFieldError = (fieldPath: string) => {
    return (
      validationErrors[fieldPath]?.[0] ||
      errors[fieldPath as keyof DataManagementSettingsData]?.message
    );
  };

  const addDataRetentionPolicy = () => {
    const newPolicy = {
      dataType: '',
      retentionPeriod: 1,
      unit: 'years' as const,
      action: 'archive' as const,
    };
    setValue('dataRetention.policies', [
      ...watchedValues.dataRetention.policies,
      newPolicy,
    ]);
  };

  const removeDataRetentionPolicy = (index: number) => {
    const policies = watchedValues.dataRetention.policies.filter(
      (_, i) => i !== index
    );
    setValue('dataRetention.policies', policies);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Data Management
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Configure backup, export, retention, and privacy settings
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
            <Button onClick={() => setIsEditing(true)}>
              Edit Data Management
            </Button>
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
        {/* Backup Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Backup Settings
            </CardTitle>
            <CardDescription>
              Configure automated backup schedules and storage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Backup Schedule */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Backup Schedule</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Frequency</Label>
                  <Select
                    value={watchedValues.backup?.schedule?.frequency || 'daily'}
                    onValueChange={value =>
                      setValue('backup.schedule.frequency', value as any)
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backupTime">Time</Label>
                  <Input
                    id="backupTime"
                    type="time"
                    {...register('backup.schedule.time')}
                    disabled={!isEditing}
                    className={
                      getFieldError('backup.schedule.time')
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {getFieldError('backup.schedule.time') && (
                    <p className="text-sm text-red-600">
                      {getFieldError('backup.schedule.time')}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Backup Days</Label>
                <div className="grid grid-cols-7 gap-2">
                  {[
                    { key: 0, label: 'Sun' },
                    { key: 1, label: 'Mon' },
                    { key: 2, label: 'Tue' },
                    { key: 3, label: 'Wed' },
                    { key: 4, label: 'Thu' },
                    { key: 5, label: 'Fri' },
                    { key: 6, label: 'Sat' },
                  ].map(day => (
                    <div key={day.key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`backup-day-${day.key}`}
                        checked={
                          watchedValues.backup?.schedule?.days?.includes(
                            day.key
                          ) || false
                        }
                        onChange={e => {
                          const current =
                            watchedValues.backup?.schedule?.days || [];
                          const updated = e.target.checked
                            ? [...current, day.key]
                            : current.filter(d => d !== day.key);
                          setValue('backup.schedule.days', updated);
                        }}
                        disabled={!isEditing}
                        className="rounded border-gray-300"
                      />
                      <Label
                        htmlFor={`backup-day-${day.key}`}
                        className="text-sm"
                      >
                        {day.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Active</Label>
                  <p className="text-sm text-gray-600">
                    Enable automated backups
                  </p>
                </div>
                <Switch
                  checked={watchedValues.backup?.schedule?.isActive || false}
                  onCheckedChange={checked =>
                    setValue('backup.schedule.isActive', checked)
                  }
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Backup Retention */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Backup Retention</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dailyRetention">Daily (days)</Label>
                  <Input
                    id="dailyRetention"
                    type="number"
                    min="0"
                    max="365"
                    {...register('backup.retention.daily', {
                      required: 'Daily retention is required',
                      min: { value: 0, message: 'Must be between 0-365' },
                      max: { value: 365, message: 'Must be between 0-365' },
                    })}
                    disabled={!isEditing}
                    className={
                      getFieldError('backup.retention.daily')
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {getFieldError('backup.retention.daily') && (
                    <p className="text-sm text-red-600">
                      {getFieldError('backup.retention.daily')}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weeklyRetention">Weekly (weeks)</Label>
                  <Input
                    id="weeklyRetention"
                    type="number"
                    min="0"
                    max="52"
                    {...register('backup.retention.weekly', {
                      required: 'Weekly retention is required',
                      min: { value: 0, message: 'Must be between 0-52' },
                      max: { value: 52, message: 'Must be between 0-52' },
                    })}
                    disabled={!isEditing}
                    className={
                      getFieldError('backup.retention.weekly')
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {getFieldError('backup.retention.weekly') && (
                    <p className="text-sm text-red-600">
                      {getFieldError('backup.retention.weekly')}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyRetention">Monthly (months)</Label>
                  <Input
                    id="monthlyRetention"
                    type="number"
                    min="0"
                    max="12"
                    {...register('backup.retention.monthly', {
                      required: 'Monthly retention is required',
                      min: { value: 0, message: 'Must be between 0-12' },
                      max: { value: 12, message: 'Must be between 0-12' },
                    })}
                    disabled={!isEditing}
                    className={
                      getFieldError('backup.retention.monthly')
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {getFieldError('backup.retention.monthly') && (
                    <p className="text-sm text-red-600">
                      {getFieldError('backup.retention.monthly')}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearlyRetention">Yearly (years)</Label>
                  <Input
                    id="yearlyRetention"
                    type="number"
                    min="0"
                    max="10"
                    {...register('backup.retention.yearly', {
                      required: 'Yearly retention is required',
                      min: { value: 0, message: 'Must be between 0-10' },
                      max: { value: 10, message: 'Must be between 0-10' },
                    })}
                    disabled={!isEditing}
                    className={
                      getFieldError('backup.retention.yearly')
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {getFieldError('backup.retention.yearly') && (
                    <p className="text-sm text-red-600">
                      {getFieldError('backup.retention.yearly')}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Storage Configuration */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">
                Storage Configuration
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storageType">Storage Type</Label>
                  <Select
                    value={watchedValues.backup?.storage?.type || 'cloud'}
                    onValueChange={value =>
                      setValue('backup.storage.type', value as any)
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Local Storage</SelectItem>
                      <SelectItem value="cloud">Cloud Storage</SelectItem>
                      <SelectItem value="hybrid">
                        Hybrid (Local + Cloud)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storageLocation">Storage Location</Label>
                  <Input
                    id="storageLocation"
                    {...register('backup.storage.location')}
                    disabled={!isEditing}
                    placeholder="e.g., /backups, s3://bucket-name"
                    className={
                      getFieldError('backup.storage.location')
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {getFieldError('backup.storage.location') && (
                    <p className="text-sm text-red-600">
                      {getFieldError('backup.storage.location')}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Encryption */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Encryption</h4>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Encryption</Label>
                  <p className="text-sm text-gray-600">
                    Encrypt backup files for security
                  </p>
                </div>
                <Switch
                  checked={watchedValues.backup?.encryption?.enabled || false}
                  onCheckedChange={checked =>
                    setValue('backup.encryption.enabled', checked)
                  }
                  disabled={!isEditing}
                />
              </div>

              {(watchedValues.backup?.encryption?.enabled || false) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="encryptionAlgorithm">Algorithm</Label>
                    <Select
                      value={
                        watchedValues.backup?.encryption?.algorithm || 'AES-256'
                      }
                      onValueChange={value =>
                        setValue('backup.encryption.algorithm', value)
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AES-256">AES-256</SelectItem>
                        <SelectItem value="AES-128">AES-128</SelectItem>
                        <SelectItem value="ChaCha20">ChaCha20</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keyRotation">Key Rotation (days)</Label>
                    <Input
                      id="keyRotation"
                      type="number"
                      min="30"
                      max="365"
                      {...register('backup.encryption.keyRotation', {
                        required: 'Key rotation is required',
                        min: { value: 30, message: 'Minimum 30 days' },
                        max: { value: 365, message: 'Maximum 365 days' },
                      })}
                      disabled={!isEditing}
                      className={
                        getFieldError('backup.encryption.keyRotation')
                          ? 'border-red-500'
                          : ''
                      }
                    />
                    {getFieldError('backup.encryption.keyRotation') && (
                      <p className="text-sm text-red-600">
                        {getFieldError('backup.encryption.keyRotation')}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Data Export */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Data Export
            </CardTitle>
            <CardDescription>
              Configure data export formats and delivery methods
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Export Formats */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Export Formats</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { type: 'csv', name: 'CSV', isActive: true },
                  { type: 'excel', name: 'Excel', isActive: true },
                  { type: 'json', name: 'JSON', isActive: false },
                  { type: 'xml', name: 'XML', isActive: false },
                ].map(format => (
                  <div
                    key={format.type}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      id={`format-${format.type}`}
                      checked={watchedValues.dataExport.formats.some(
                        f => f.type === format.type && f.isActive
                      )}
                      onChange={e => {
                        const current = watchedValues.dataExport.formats;
                        const updated = current.map(f =>
                          f.type === format.type
                            ? { ...f, isActive: e.target.checked }
                            : f
                        );
                        setValue('dataExport.formats', updated);
                      }}
                      disabled={!isEditing}
                      className="rounded border-gray-300"
                    />
                    <Label
                      htmlFor={`format-${format.type}`}
                      className="text-sm"
                    >
                      {format.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Configuration */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">
                Delivery Configuration
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deliveryMethod">Delivery Method</Label>
                  <Select
                    value={watchedValues.dataExport.delivery.method}
                    onValueChange={value =>
                      setValue('dataExport.delivery.method', value as any)
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="ftp">FTP</SelectItem>
                      <SelectItem value="api">API</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryDestination">Destination</Label>
                  <Input
                    id="deliveryDestination"
                    {...register('dataExport.delivery.destination')}
                    disabled={!isEditing}
                    placeholder="email@company.com or ftp://server.com"
                    className={
                      getFieldError('dataExport.delivery.destination')
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {getFieldError('dataExport.delivery.destination') && (
                    <p className="text-sm text-red-600">
                      {getFieldError('dataExport.delivery.destination')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Retention Policies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5" />
              Data Retention Policies
            </CardTitle>
            <CardDescription>
              Configure data retention and cleanup policies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Retention Policies</h4>
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addDataRetentionPolicy}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Policy
                </Button>
              )}
            </div>

            {watchedValues.dataRetention.policies.map((policy, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h5 className="font-medium">Policy {index + 1}</h5>
                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeDataRetentionPolicy(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`policy-dataType-${index}`}>
                      Data Type
                    </Label>
                    <Input
                      id={`policy-dataType-${index}`}
                      {...register(`dataRetention.policies.${index}.dataType`)}
                      disabled={!isEditing}
                      placeholder="e.g., user_data, transaction_data"
                      className={
                        getFieldError(
                          `dataRetention.policies.${index}.dataType`
                        )
                          ? 'border-red-500'
                          : ''
                      }
                    />
                    {getFieldError(
                      `dataRetention.policies.${index}.dataType`
                    ) && (
                      <p className="text-sm text-red-600">
                        {getFieldError(
                          `dataRetention.policies.${index}.dataType`
                        )}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`policy-retentionPeriod-${index}`}>
                      Retention Period
                    </Label>
                    <Input
                      id={`policy-retentionPeriod-${index}`}
                      type="number"
                      min="1"
                      {...register(
                        `dataRetention.policies.${index}.retentionPeriod`,
                        {
                          required: 'Retention period is required',
                          min: { value: 1, message: 'Must be at least 1' },
                        }
                      )}
                      disabled={!isEditing}
                      className={
                        getFieldError(
                          `dataRetention.policies.${index}.retentionPeriod`
                        )
                          ? 'border-red-500'
                          : ''
                      }
                    />
                    {getFieldError(
                      `dataRetention.policies.${index}.retentionPeriod`
                    ) && (
                      <p className="text-sm text-red-600">
                        {getFieldError(
                          `dataRetention.policies.${index}.retentionPeriod`
                        )}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`policy-unit-${index}`}>Unit</Label>
                    <Select
                      value={policy.unit}
                      onValueChange={value =>
                        setValue(
                          `dataRetention.policies.${index}.unit`,
                          value as any
                        )
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="months">Months</SelectItem>
                        <SelectItem value="years">Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`policy-action-${index}`}>Action</Label>
                    <Select
                      value={policy.action}
                      onValueChange={value =>
                        setValue(
                          `dataRetention.policies.${index}.action`,
                          value as any
                        )
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="delete">Delete</SelectItem>
                        <SelectItem value="archive">Archive</SelectItem>
                        <SelectItem value="anonymize">Anonymize</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between">
              <div>
                <Label>Automatic Cleanup</Label>
                <p className="text-sm text-gray-600">
                  Automatically apply retention policies
                </p>
              </div>
              <Switch
                checked={watchedValues.dataRetention.automaticCleanup}
                onCheckedChange={checked =>
                  setValue('dataRetention.automaticCleanup', checked)
                }
                disabled={!isEditing}
              />
            </div>

            {/* Archive Settings */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Archive Settings</h4>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Archiving</Label>
                  <p className="text-sm text-gray-600">
                    Archive data before deletion
                  </p>
                </div>
                <Switch
                  checked={watchedValues.dataRetention.archiveSettings.enabled}
                  onCheckedChange={checked =>
                    setValue('dataRetention.archiveSettings.enabled', checked)
                  }
                  disabled={!isEditing}
                />
              </div>

              {watchedValues.dataRetention.archiveSettings.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="archiveLocation">Archive Location</Label>
                    <Input
                      id="archiveLocation"
                      {...register('dataRetention.archiveSettings.location')}
                      disabled={!isEditing}
                      placeholder="e.g., /archive, s3://archive-bucket"
                      className={
                        getFieldError('dataRetention.archiveSettings.location')
                          ? 'border-red-500'
                          : ''
                      }
                    />
                    {getFieldError(
                      'dataRetention.archiveSettings.location'
                    ) && (
                      <p className="text-sm text-red-600">
                        {getFieldError(
                          'dataRetention.archiveSettings.location'
                        )}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Compression</Label>
                      <Switch
                        checked={
                          watchedValues.dataRetention.archiveSettings
                            .compression
                        }
                        onCheckedChange={checked =>
                          setValue(
                            'dataRetention.archiveSettings.compression',
                            checked
                          )
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Encryption</Label>
                      <Switch
                        checked={
                          watchedValues.dataRetention.archiveSettings.encryption
                        }
                        onCheckedChange={checked =>
                          setValue(
                            'dataRetention.archiveSettings.encryption',
                            checked
                          )
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy Settings
            </CardTitle>
            <CardDescription>
              Configure privacy and data protection settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>GDPR Compliance</Label>
                  <p className="text-sm text-gray-600">
                    Enable GDPR compliance features
                  </p>
                </div>
                <Switch
                  checked={watchedValues.privacy?.gdprCompliance || false}
                  onCheckedChange={checked =>
                    setValue('privacy.gdprCompliance', checked)
                  }
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Data Anonymization</Label>
                  <p className="text-sm text-gray-600">
                    Anonymize personal data in exports
                  </p>
                </div>
                <Switch
                  checked={watchedValues.privacy?.dataAnonymization || false}
                  onCheckedChange={checked =>
                    setValue('privacy.dataAnonymization', checked)
                  }
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Right to Erasure</Label>
                  <p className="text-sm text-gray-600">
                    Allow users to request data deletion
                  </p>
                </div>
                <Switch
                  checked={watchedValues.privacy?.rightToErasure || false}
                  onCheckedChange={checked =>
                    setValue('privacy.rightToErasure', checked)
                  }
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Data Portability</Label>
                  <p className="text-sm text-gray-600">
                    Allow users to export their data
                  </p>
                </div>
                <Switch
                  checked={watchedValues.privacy?.dataPortability || false}
                  onCheckedChange={checked =>
                    setValue('privacy.dataPortability', checked)
                  }
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
