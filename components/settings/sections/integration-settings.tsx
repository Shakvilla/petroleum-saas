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
import { Plus, Trash2, ExternalLink, Key, Webhook } from 'lucide-react';
import type { IntegrationSettingsData } from '@/types/settings';

interface IntegrationSettingsProps {
  data: IntegrationSettingsData;
  validationErrors: Record<string, string[]>;
  onUpdate: (data: IntegrationSettingsData) => void;
}

export function IntegrationSettings({
  data,
  validationErrors,
  onUpdate,
}: IntegrationSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<IntegrationSettingsData>({
    defaultValues: data,
  });

  const watchedValues = watch();

  const onSubmit = (formData: IntegrationSettingsData) => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    Object.keys(data).forEach(key => {
      setValue(
        key as keyof IntegrationSettingsData,
        data[key as keyof IntegrationSettingsData]
      );
    });
  };

  const getFieldError = (fieldPath: string) => {
    return (
      validationErrors[fieldPath]?.[0] ||
      errors[fieldPath as keyof IntegrationSettingsData]?.message
    );
  };

  const addErpSystem = () => {
    const newSystem = {
      id: `erp-${Date.now()}`,
      name: '',
      type: 'custom' as const,
      connectionString: '',
      isActive: false,
      syncSchedule: '',
      lastSync: new Date(),
    };
    setValue('externalIntegrations.erpSystems', [
      ...(watchedValues.externalIntegrations?.erpSystems || []),
      newSystem,
    ]);
  };

  const removeErpSystem = (index: number) => {
    const systems = (
      watchedValues.externalIntegrations?.erpSystems || []
    ).filter((_, i) => i !== index);
    setValue('externalIntegrations.erpSystems', systems);
  };

  const addApiKey = () => {
    const newKey = {
      id: `key-${Date.now()}`,
      name: '',
      key: '',
      permissions: [],
      isActive: false,
    };
    setValue('apiManagement.apiKeys', [
      ...(watchedValues.apiManagement?.apiKeys || []),
      newKey,
    ]);
  };

  const removeApiKey = (index: number) => {
    const keys = (watchedValues.apiManagement?.apiKeys || []).filter(
      (_, i) => i !== index
    );
    setValue('apiManagement.apiKeys', keys);
  };

  const addWebhook = () => {
    const newWebhook = {
      id: `webhook-${Date.now()}`,
      name: '',
      url: '',
      events: [],
      secret: '',
      isActive: false,
      retryPolicy: {
        maxRetries: 3,
        backoffStrategy: 'exponential' as const,
        initialDelay: 1000,
      },
    };
    setValue('apiManagement.webhooks', [
      ...(watchedValues.apiManagement?.webhooks || []),
      newWebhook,
    ]);
  };

  const removeWebhook = (index: number) => {
    const webhooks = (watchedValues.apiManagement?.webhooks || []).filter(
      (_, i) => i !== index
    );
    setValue('apiManagement.webhooks', webhooks);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Integrations</h2>
          <p className="text-sm text-gray-600 mt-1">
            Configure external systems, APIs, and data synchronization
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
              Edit Integrations
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
        {/* External Integrations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              External Integrations
            </CardTitle>
            <CardDescription>
              Connect to ERP systems, accounting software, and IoT devices
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* ERP Systems */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">ERP Systems</h4>
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addErpSystem}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add ERP System
                  </Button>
                )}
              </div>

              {(watchedValues.externalIntegrations?.erpSystems || []).map(
                (system, index) => (
                  <div
                    key={system.id}
                    className="p-4 border border-gray-200 rounded-lg space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium">ERP System {index + 1}</h5>
                      {isEditing && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeErpSystem(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`erp-name-${index}`}>System Name</Label>
                        <Input
                          id={`erp-name-${index}`}
                          {...register(
                            `externalIntegrations.erpSystems.${index}.name`
                          )}
                          disabled={!isEditing}
                          placeholder="e.g., SAP, Oracle, Microsoft Dynamics"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`erp-type-${index}`}>System Type</Label>
                        <Select
                          value={system.type}
                          onValueChange={value =>
                            setValue(
                              `externalIntegrations.erpSystems.${index}.type`,
                              value as any
                            )
                          }
                          disabled={!isEditing}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sap">SAP</SelectItem>
                            <SelectItem value="oracle">Oracle</SelectItem>
                            <SelectItem value="microsoft">Microsoft</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`erp-connection-${index}`}>
                        Connection String
                      </Label>
                      <Input
                        id={`erp-connection-${index}`}
                        {...register(
                          `externalIntegrations.erpSystems.${index}.connectionString`
                        )}
                        disabled={!isEditing}
                        placeholder="Database connection string or API endpoint"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`erp-schedule-${index}`}>
                          Sync Schedule
                        </Label>
                        <Input
                          id={`erp-schedule-${index}`}
                          {...register(
                            `externalIntegrations.erpSystems.${index}.syncSchedule`
                          )}
                          disabled={!isEditing}
                          placeholder="e.g., Every 4 hours, Daily at 2 AM"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>Active</Label>
                        <Switch
                          checked={system.isActive}
                          onCheckedChange={checked =>
                            setValue(
                              `externalIntegrations.erpSystems.${index}.isActive`,
                              checked
                            )
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* API Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Management
            </CardTitle>
            <CardDescription>
              Manage API keys, rate limits, and webhooks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* API Keys */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">API Keys</h4>
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addApiKey}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add API Key
                  </Button>
                )}
              </div>

              {(watchedValues.apiManagement?.apiKeys || []).map(
                (apiKey, index) => (
                  <div
                    key={apiKey.id}
                    className="p-4 border border-gray-200 rounded-lg space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium">API Key {index + 1}</h5>
                      {isEditing && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeApiKey(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`api-name-${index}`}>Key Name</Label>
                        <Input
                          id={`api-name-${index}`}
                          {...register(`apiManagement.apiKeys.${index}.name`)}
                          disabled={!isEditing}
                          placeholder="e.g., Mobile App, Third Party Integration"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`api-key-${index}`}>API Key</Label>
                        <Input
                          id={`api-key-${index}`}
                          {...register(`apiManagement.apiKeys.${index}.key`)}
                          disabled={!isEditing}
                          placeholder="Enter API key"
                          type="password"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Active</Label>
                      <Switch
                        checked={apiKey.isActive}
                        onCheckedChange={checked =>
                          setValue(
                            `apiManagement.apiKeys.${index}.isActive`,
                            checked
                          )
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Webhooks */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Webhooks</h4>
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addWebhook}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Webhook
                  </Button>
                )}
              </div>

              {(watchedValues.apiManagement?.webhooks || []).map(
                (webhook, index) => (
                  <div
                    key={webhook.id}
                    className="p-4 border border-gray-200 rounded-lg space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium">Webhook {index + 1}</h5>
                      {isEditing && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeWebhook(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`webhook-name-${index}`}>
                          Webhook Name
                        </Label>
                        <Input
                          id={`webhook-name-${index}`}
                          {...register(`apiManagement.webhooks.${index}.name`)}
                          disabled={!isEditing}
                          placeholder="e.g., Order Updates, Inventory Changes"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`webhook-url-${index}`}>
                          Webhook URL
                        </Label>
                        <Input
                          id={`webhook-url-${index}`}
                          {...register(`apiManagement.webhooks.${index}.url`)}
                          disabled={!isEditing}
                          placeholder="https://your-system.com/webhook"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`webhook-secret-${index}`}>
                        Webhook Secret
                      </Label>
                      <Input
                        id={`webhook-secret-${index}`}
                        {...register(`apiManagement.webhooks.${index}.secret`)}
                        disabled={!isEditing}
                        placeholder="Enter webhook secret for verification"
                        type="password"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`webhook-retries-${index}`}>
                          Max Retries
                        </Label>
                        <Input
                          id={`webhook-retries-${index}`}
                          type="number"
                          min="0"
                          max="10"
                          {...register(
                            `apiManagement.webhooks.${index}.retryPolicy.maxRetries`
                          )}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`webhook-strategy-${index}`}>
                          Backoff Strategy
                        </Label>
                        <Select
                          value={
                            webhook.retryPolicy?.backoffStrategy ||
                            'exponential'
                          }
                          onValueChange={value =>
                            setValue(
                              `apiManagement.webhooks.${index}.retryPolicy.backoffStrategy`,
                              value as any
                            )
                          }
                          disabled={!isEditing}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="linear">Linear</SelectItem>
                            <SelectItem value="exponential">
                              Exponential
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>Active</Label>
                        <Switch
                          checked={webhook.isActive || false}
                          onCheckedChange={checked =>
                            setValue(
                              `apiManagement.webhooks.${index}.isActive`,
                              checked
                            )
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
