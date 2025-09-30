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
import { Bell, Mail, Smartphone, Monitor, AlertTriangle } from 'lucide-react';
import type { NotificationSettingsData } from '@/types/settings';

interface NotificationSettingsProps {
  data: NotificationSettingsData;
  validationErrors: Record<string, string[]>;
  onUpdate: (data: NotificationSettingsData) => void;
}

export function NotificationSettings({
  data,
  validationErrors,
  onUpdate,
}: NotificationSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<NotificationSettingsData>({
    defaultValues: data,
  });

  const watchedValues = watch();

  const onSubmit = (formData: NotificationSettingsData) => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    Object.keys(data).forEach(key => {
      setValue(
        key as keyof NotificationSettingsData,
        data[key as keyof NotificationSettingsData]
      );
    });
  };

  const getFieldError = (fieldPath: string) => {
    return (
      validationErrors[fieldPath]?.[0] ||
      errors[fieldPath as keyof NotificationSettingsData]?.message
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          <p className="text-sm text-gray-600 mt-1">
            Configure alert thresholds, communication channels, and notification
            templates
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
              Edit Notifications
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
        {/* Communication Channels */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Communication Channels
            </CardTitle>
            <CardDescription>
              Configure how notifications are delivered to users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Notifications */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <Label className="text-base font-medium">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-gray-600">
                      Send notifications via email
                    </p>
                  </div>
                </div>
                <Switch
                  checked={watchedValues.channels?.email?.enabled || false}
                  onCheckedChange={checked =>
                    setValue('channels.email.enabled', checked)
                  }
                  disabled={!isEditing}
                />
              </div>

              {watchedValues.channels?.email?.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="smtpServer">SMTP Server</Label>
                    <Input
                      id="smtpServer"
                      {...register('channels.email.smtpServer')}
                      disabled={!isEditing}
                      placeholder="smtp.gmail.com"
                      className={
                        getFieldError('channels.email.smtpServer')
                          ? 'border-red-500'
                          : ''
                      }
                    />
                    {getFieldError('channels.email.smtpServer') && (
                      <p className="text-sm text-red-600">
                        {getFieldError('channels.email.smtpServer')}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      type="number"
                      {...register('channels.email.smtpPort')}
                      disabled={!isEditing}
                      placeholder="587"
                      className={
                        getFieldError('channels.email.smtpPort')
                          ? 'border-red-500'
                          : ''
                      }
                    />
                    {getFieldError('channels.email.smtpPort') && (
                      <p className="text-sm text-red-600">
                        {getFieldError('channels.email.smtpPort')}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtpUsername">Username</Label>
                    <Input
                      id="smtpUsername"
                      {...register('channels.email.username')}
                      disabled={!isEditing}
                      placeholder="your-email@company.com"
                      className={
                        getFieldError('channels.email.username')
                          ? 'border-red-500'
                          : ''
                      }
                    />
                    {getFieldError('channels.email.username') && (
                      <p className="text-sm text-red-600">
                        {getFieldError('channels.email.username')}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fromAddress">From Address</Label>
                    <Input
                      id="fromAddress"
                      type="email"
                      {...register('channels.email.fromAddress')}
                      disabled={!isEditing}
                      placeholder="noreply@company.com"
                      className={
                        getFieldError('channels.email.fromAddress')
                          ? 'border-red-500'
                          : ''
                      }
                    />
                    {getFieldError('channels.email.fromAddress') && (
                      <p className="text-sm text-red-600">
                        {getFieldError('channels.email.fromAddress')}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* SMS Notifications */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-green-600" />
                  <div>
                    <Label className="text-base font-medium">
                      SMS Notifications
                    </Label>
                    <p className="text-sm text-gray-600">
                      Send notifications via SMS
                    </p>
                  </div>
                </div>
                <Switch
                  checked={watchedValues.channels?.sms?.enabled || false}
                  onCheckedChange={checked =>
                    setValue('channels.sms.enabled', checked)
                  }
                  disabled={!isEditing}
                />
              </div>

              {watchedValues.channels?.sms?.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="smsProvider">SMS Provider</Label>
                    <Select
                      value={watchedValues.channels?.sms?.provider || ''}
                      onValueChange={value =>
                        setValue('channels.sms.provider', value)
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select SMS provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="twilio">Twilio</SelectItem>
                        <SelectItem value="aws-sns">AWS SNS</SelectItem>
                        <SelectItem value="sendgrid">SendGrid</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smsApiKey">API Key</Label>
                    <Input
                      id="smsApiKey"
                      {...register('channels.sms.apiKey')}
                      disabled={!isEditing}
                      placeholder="Your SMS provider API key"
                      type="password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fromNumber">From Number</Label>
                    <Input
                      id="fromNumber"
                      {...register('channels.sms.fromNumber')}
                      disabled={!isEditing}
                      placeholder="+1234567890"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* In-App Notifications */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-purple-600" />
                  <div>
                    <Label className="text-base font-medium">
                      In-App Notifications
                    </Label>
                    <p className="text-sm text-gray-600">
                      Show notifications within the application
                    </p>
                  </div>
                </div>
                <Switch
                  checked={watchedValues.channels?.inApp?.enabled || false}
                  onCheckedChange={checked =>
                    setValue('channels.inApp.enabled', checked)
                  }
                  disabled={!isEditing}
                />
              </div>

              {watchedValues.channels?.inApp?.enabled && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <Label>Sound Notifications</Label>
                    <Switch
                      checked={
                        watchedValues.channels?.inApp?.soundEnabled || false
                      }
                      onCheckedChange={checked =>
                        setValue('channels.inApp.soundEnabled', checked)
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Desktop Notifications</Label>
                    <Switch
                      checked={
                        watchedValues.channels.inApp.desktopNotifications
                      }
                      onCheckedChange={checked =>
                        setValue('channels.inApp.desktopNotifications', checked)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Alert Thresholds */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alert Thresholds
            </CardTitle>
            <CardDescription>
              Configure when alerts should be triggered
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Inventory Alerts */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Inventory Alerts</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lowLevel">Low Level (%)</Label>
                  <Input
                    id="lowLevel"
                    type="number"
                    min="0"
                    max="100"
                    {...register('alertThresholds.inventory.lowLevel', {
                      required: 'Low level is required',
                      min: { value: 0, message: 'Must be between 0-100' },
                      max: { value: 100, message: 'Must be between 0-100' },
                    })}
                    disabled={!isEditing}
                    className={
                      getFieldError('alertThresholds.inventory.lowLevel')
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {getFieldError('alertThresholds.inventory.lowLevel') && (
                    <p className="text-sm text-red-600">
                      {getFieldError('alertThresholds.inventory.lowLevel')}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="criticalLevel">Critical Level (%)</Label>
                  <Input
                    id="criticalLevel"
                    type="number"
                    min="0"
                    max="100"
                    {...register('alertThresholds.inventory.criticalLevel', {
                      required: 'Critical level is required',
                      min: { value: 0, message: 'Must be between 0-100' },
                      max: { value: 100, message: 'Must be between 0-100' },
                    })}
                    disabled={!isEditing}
                    className={
                      getFieldError('alertThresholds.inventory.criticalLevel')
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {getFieldError('alertThresholds.inventory.criticalLevel') && (
                    <p className="text-sm text-red-600">
                      {getFieldError('alertThresholds.inventory.criticalLevel')}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temperatureHigh">High Temperature (°C)</Label>
                  <Input
                    id="temperatureHigh"
                    type="number"
                    {...register('alertThresholds.inventory.temperatureHigh')}
                    disabled={!isEditing}
                    className={
                      getFieldError('alertThresholds.inventory.temperatureHigh')
                        ? 'border-red-500'
                        : ''
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperatureLow">Low Temperature (°C)</Label>
                  <Input
                    id="temperatureLow"
                    type="number"
                    {...register('alertThresholds.inventory.temperatureLow')}
                    disabled={!isEditing}
                    className={
                      getFieldError('alertThresholds.inventory.temperatureLow')
                        ? 'border-red-500'
                        : ''
                    }
                  />
                </div>
              </div>
            </div>

            {/* Delivery Alerts */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Delivery Alerts</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="delayMinutes">Delay Alert (minutes)</Label>
                  <Input
                    id="delayMinutes"
                    type="number"
                    min="0"
                    max="1440"
                    {...register('alertThresholds.delivery.delayMinutes', {
                      required: 'Delay minutes is required',
                      min: { value: 0, message: 'Must be between 0-1440' },
                      max: { value: 1440, message: 'Must be between 0-1440' },
                    })}
                    disabled={!isEditing}
                    className={
                      getFieldError('alertThresholds.delivery.delayMinutes')
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {getFieldError('alertThresholds.delivery.delayMinutes') && (
                    <p className="text-sm text-red-600">
                      {getFieldError('alertThresholds.delivery.delayMinutes')}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="routeDeviation">Route Deviation (%)</Label>
                  <Input
                    id="routeDeviation"
                    type="number"
                    min="0"
                    max="100"
                    {...register('alertThresholds.delivery.routeDeviation', {
                      required: 'Route deviation is required',
                      min: { value: 0, message: 'Must be between 0-100' },
                      max: { value: 100, message: 'Must be between 0-100' },
                    })}
                    disabled={!isEditing}
                    className={
                      getFieldError('alertThresholds.delivery.routeDeviation')
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {getFieldError('alertThresholds.delivery.routeDeviation') && (
                    <p className="text-sm text-red-600">
                      {getFieldError('alertThresholds.delivery.routeDeviation')}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fuelLevelLow">Low Fuel Level (%)</Label>
                  <Input
                    id="fuelLevelLow"
                    type="number"
                    min="0"
                    max="100"
                    {...register('alertThresholds.delivery.fuelLevelLow', {
                      required: 'Fuel level is required',
                      min: { value: 0, message: 'Must be between 0-100' },
                      max: { value: 100, message: 'Must be between 0-100' },
                    })}
                    disabled={!isEditing}
                    className={
                      getFieldError('alertThresholds.delivery.fuelLevelLow')
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {getFieldError('alertThresholds.delivery.fuelLevelLow') && (
                    <p className="text-sm text-red-600">
                      {getFieldError('alertThresholds.delivery.fuelLevelLow')}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* System Alerts */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">System Alerts</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="diskUsage">Disk Usage (%)</Label>
                  <Input
                    id="diskUsage"
                    type="number"
                    min="0"
                    max="100"
                    {...register('alertThresholds.system.diskUsage', {
                      required: 'Disk usage is required',
                      min: { value: 0, message: 'Must be between 0-100' },
                      max: { value: 100, message: 'Must be between 0-100' },
                    })}
                    disabled={!isEditing}
                    className={
                      getFieldError('alertThresholds.system.diskUsage')
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {getFieldError('alertThresholds.system.diskUsage') && (
                    <p className="text-sm text-red-600">
                      {getFieldError('alertThresholds.system.diskUsage')}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="memoryUsage">Memory Usage (%)</Label>
                  <Input
                    id="memoryUsage"
                    type="number"
                    min="0"
                    max="100"
                    {...register('alertThresholds.system.memoryUsage', {
                      required: 'Memory usage is required',
                      min: { value: 0, message: 'Must be between 0-100' },
                      max: { value: 100, message: 'Must be between 0-100' },
                    })}
                    disabled={!isEditing}
                    className={
                      getFieldError('alertThresholds.system.memoryUsage')
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {getFieldError('alertThresholds.system.memoryUsage') && (
                    <p className="text-sm text-red-600">
                      {getFieldError('alertThresholds.system.memoryUsage')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
