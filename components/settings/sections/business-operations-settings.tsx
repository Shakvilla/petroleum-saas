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
import { Clock, Settings, AlertTriangle, CheckCircle } from 'lucide-react';
import type { BusinessOperationsData } from '@/types/settings';

interface BusinessOperationsSettingsProps {
  data: BusinessOperationsData;
  validationErrors: Record<string, string[]>;
  onUpdate: (data: BusinessOperationsData) => void;
}

export function BusinessOperationsSettings({
  data,
  validationErrors,
  onUpdate,
}: BusinessOperationsSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<BusinessOperationsData>({
    defaultValues: data,
  });

  const watchedValues = watch();

  const onSubmit = (formData: BusinessOperationsData) => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to original data
    Object.keys(data).forEach(key => {
      setValue(
        key as keyof BusinessOperationsData,
        data[key as keyof BusinessOperationsData]
      );
    });
  };

  const getFieldError = (fieldPath: string) => {
    return (
      validationErrors[fieldPath]?.[0] ||
      errors[fieldPath as keyof BusinessOperationsData]?.message
    );
  };

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ] as const;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Business Operations
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Configure business hours, operational parameters, and workflow
            settings
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
            <Button onClick={() => setIsEditing(true)}>Edit Operations</Button>
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
        {/* Business Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Business Hours
            </CardTitle>
            <CardDescription>
              Set operating hours for each day of the week
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {days.map(day => (
              <div
                key={day.key}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center"
              >
                <div className="flex items-center gap-2">
                  <Switch
                    checked={watchedValues.businessHours[day.key].isActive}
                    onCheckedChange={checked =>
                      setValue(`businessHours.${day.key}.isActive`, checked)
                    }
                    disabled={!isEditing}
                  />
                  <Label className="font-medium">{day.label}</Label>
                </div>

                {watchedValues.businessHours[day.key].isActive && (
                  <>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">
                        Start Time
                      </Label>
                      <Input
                        type="time"
                        {...register(`businessHours.${day.key}.start`)}
                        disabled={!isEditing}
                        className={
                          getFieldError(`businessHours.${day.key}.start`)
                            ? 'border-red-500'
                            : ''
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">End Time</Label>
                      <Input
                        type="time"
                        {...register(`businessHours.${day.key}.end`)}
                        disabled={!isEditing}
                        className={
                          getFieldError(`businessHours.${day.key}.end`)
                            ? 'border-red-500'
                            : ''
                        }
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      {watchedValues.businessHours[day.key].isActive ? (
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-200"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-gray-500 border-gray-200"
                        >
                          Inactive
                        </Badge>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Operational Parameters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Operational Parameters
            </CardTitle>
            <CardDescription>
              Configure fuel types, capacity limits, and safety thresholds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Fuel Types */}
            <div className="space-y-2">
              <Label>Fuel Types *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  'gasoline',
                  'diesel',
                  'kerosene',
                  'lubricant',
                  'jet_fuel',
                ].map(fuelType => (
                  <div key={fuelType} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={fuelType}
                      checked={watchedValues.operationalParams.fuelTypes.includes(
                        fuelType as any
                      )}
                      onChange={e => {
                        const currentTypes =
                          watchedValues.operationalParams.fuelTypes;
                        const newTypes = e.target.checked
                          ? [...currentTypes, fuelType]
                          : currentTypes.filter(type => type !== fuelType);
                        setValue(
                          'operationalParams.fuelTypes',
                          newTypes as any
                        );
                      }}
                      disabled={!isEditing}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={fuelType} className="text-sm capitalize">
                      {fuelType.replace('_', ' ')}
                    </Label>
                  </div>
                ))}
              </div>
              {getFieldError('operationalParams.fuelTypes') && (
                <p className="text-sm text-red-600">
                  {getFieldError('operationalParams.fuelTypes')}
                </p>
              )}
            </div>

            {/* Capacity Limits */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Capacity Limits</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxTankCapacity">Max Tank Capacity (L)</Label>
                  <Input
                    id="maxTankCapacity"
                    type="number"
                    {...register(
                      'operationalParams.capacityLimits.maxTankCapacity',
                      {
                        required: 'Max tank capacity is required',
                        min: { value: 0, message: 'Capacity must be positive' },
                      }
                    )}
                    disabled={!isEditing}
                    className={
                      getFieldError(
                        'operationalParams.capacityLimits.maxTankCapacity'
                      )
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {getFieldError(
                    'operationalParams.capacityLimits.maxTankCapacity'
                  ) && (
                    <p className="text-sm text-red-600">
                      {getFieldError(
                        'operationalParams.capacityLimits.maxTankCapacity'
                      )}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxDeliveryCapacity">
                    Max Delivery Capacity (L)
                  </Label>
                  <Input
                    id="maxDeliveryCapacity"
                    type="number"
                    {...register(
                      'operationalParams.capacityLimits.maxDeliveryCapacity',
                      {
                        required: 'Max delivery capacity is required',
                        min: { value: 0, message: 'Capacity must be positive' },
                      }
                    )}
                    disabled={!isEditing}
                    className={
                      getFieldError(
                        'operationalParams.capacityLimits.maxDeliveryCapacity'
                      )
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {getFieldError(
                    'operationalParams.capacityLimits.maxDeliveryCapacity'
                  ) && (
                    <p className="text-sm text-red-600">
                      {getFieldError(
                        'operationalParams.capacityLimits.maxDeliveryCapacity'
                      )}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxFleetSize">Max Fleet Size</Label>
                  <Input
                    id="maxFleetSize"
                    type="number"
                    {...register(
                      'operationalParams.capacityLimits.maxFleetSize',
                      {
                        required: 'Max fleet size is required',
                        min: {
                          value: 0,
                          message: 'Fleet size must be positive',
                        },
                      }
                    )}
                    disabled={!isEditing}
                    className={
                      getFieldError(
                        'operationalParams.capacityLimits.maxFleetSize'
                      )
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {getFieldError(
                    'operationalParams.capacityLimits.maxFleetSize'
                  ) && (
                    <p className="text-sm text-red-600">
                      {getFieldError(
                        'operationalParams.capacityLimits.maxFleetSize'
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Safety Thresholds */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Safety Thresholds</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lowInventoryAlert">
                    Low Inventory Alert (%)
                  </Label>
                  <Input
                    id="lowInventoryAlert"
                    type="number"
                    min="0"
                    max="100"
                    {...register(
                      'operationalParams.safetyThresholds.lowInventoryAlert',
                      {
                        required: 'Low inventory alert is required',
                        min: { value: 0, message: 'Must be between 0-100' },
                        max: { value: 100, message: 'Must be between 0-100' },
                      }
                    )}
                    disabled={!isEditing}
                    className={
                      getFieldError(
                        'operationalParams.safetyThresholds.lowInventoryAlert'
                      )
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {getFieldError(
                    'operationalParams.safetyThresholds.lowInventoryAlert'
                  ) && (
                    <p className="text-sm text-red-600">
                      {getFieldError(
                        'operationalParams.safetyThresholds.lowInventoryAlert'
                      )}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="criticalInventoryAlert">
                    Critical Inventory Alert (%)
                  </Label>
                  <Input
                    id="criticalInventoryAlert"
                    type="number"
                    min="0"
                    max="100"
                    {...register(
                      'operationalParams.safetyThresholds.criticalInventoryAlert',
                      {
                        required: 'Critical inventory alert is required',
                        min: { value: 0, message: 'Must be between 0-100' },
                        max: { value: 100, message: 'Must be between 0-100' },
                      }
                    )}
                    disabled={!isEditing}
                    className={
                      getFieldError(
                        'operationalParams.safetyThresholds.criticalInventoryAlert'
                      )
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {getFieldError(
                    'operationalParams.safetyThresholds.criticalInventoryAlert'
                  ) && (
                    <p className="text-sm text-red-600">
                      {getFieldError(
                        'operationalParams.safetyThresholds.criticalInventoryAlert'
                      )}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temperatureMin">Min Temperature (°C)</Label>
                  <Input
                    id="temperatureMin"
                    type="number"
                    {...register(
                      'operationalParams.safetyThresholds.temperatureAlerts.min'
                    )}
                    disabled={!isEditing}
                    className={
                      getFieldError(
                        'operationalParams.safetyThresholds.temperatureAlerts.min'
                      )
                        ? 'border-red-500'
                        : ''
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperatureMax">Max Temperature (°C)</Label>
                  <Input
                    id="temperatureMax"
                    type="number"
                    {...register(
                      'operationalParams.safetyThresholds.temperatureAlerts.max'
                    )}
                    disabled={!isEditing}
                    className={
                      getFieldError(
                        'operationalParams.safetyThresholds.temperatureAlerts.max'
                      )
                        ? 'border-red-500'
                        : ''
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperatureUnit">Temperature Unit</Label>
                  <Select
                    value={
                      watchedValues.operationalParams.safetyThresholds
                        .temperatureAlerts.unit
                    }
                    onValueChange={value =>
                      setValue(
                        'operationalParams.safetyThresholds.temperatureAlerts.unit',
                        value as any
                      )
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="celsius">Celsius</SelectItem>
                      <SelectItem value="fahrenheit">Fahrenheit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workflow Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Workflow Settings
            </CardTitle>
            <CardDescription>
              Configure approval processes and notification triggers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Approval Processes */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Approval Processes</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Delivery Approval</Label>
                    <p className="text-sm text-gray-600">
                      Require approval for delivery operations
                    </p>
                  </div>
                  <Switch
                    checked={
                      watchedValues.workflowSettings.approvalProcesses
                        .deliveryApproval
                    }
                    onCheckedChange={checked =>
                      setValue(
                        'workflowSettings.approvalProcesses.deliveryApproval',
                        checked
                      )
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Inventory Adjustment</Label>
                    <p className="text-sm text-gray-600">
                      Require approval for inventory adjustments
                    </p>
                  </div>
                  <Switch
                    checked={
                      watchedValues.workflowSettings.approvalProcesses
                        .inventoryAdjustment
                    }
                    onCheckedChange={checked =>
                      setValue(
                        'workflowSettings.approvalProcesses.inventoryAdjustment',
                        checked
                      )
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>User Management</Label>
                    <p className="text-sm text-gray-600">
                      Require approval for user management actions
                    </p>
                  </div>
                  <Switch
                    checked={
                      watchedValues.workflowSettings.approvalProcesses
                        .userManagement
                    }
                    onCheckedChange={checked =>
                      setValue(
                        'workflowSettings.approvalProcesses.userManagement',
                        checked
                      )
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            {/* Notification Triggers */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">
                Notification Triggers
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Inventory Alerts</Label>
                    <p className="text-sm text-gray-600">
                      Send notifications for inventory level changes
                    </p>
                  </div>
                  <Switch
                    checked={
                      watchedValues.workflowSettings.notificationTriggers
                        .inventoryAlerts
                    }
                    onCheckedChange={checked =>
                      setValue(
                        'workflowSettings.notificationTriggers.inventoryAlerts',
                        checked
                      )
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Delivery Updates</Label>
                    <p className="text-sm text-gray-600">
                      Send notifications for delivery status changes
                    </p>
                  </div>
                  <Switch
                    checked={
                      watchedValues.workflowSettings.notificationTriggers
                        .deliveryUpdates
                    }
                    onCheckedChange={checked =>
                      setValue(
                        'workflowSettings.notificationTriggers.deliveryUpdates',
                        checked
                      )
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Maintenance Reminders</Label>
                    <p className="text-sm text-gray-600">
                      Send notifications for maintenance schedules
                    </p>
                  </div>
                  <Switch
                    checked={
                      watchedValues.workflowSettings.notificationTriggers
                        .maintenanceReminders
                    }
                    onCheckedChange={checked =>
                      setValue(
                        'workflowSettings.notificationTriggers.maintenanceReminders',
                        checked
                      )
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
