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
import { Shield, Lock, Users, FileText } from 'lucide-react';
import type { SecuritySettingsData } from '@/types/settings';

interface SecuritySettingsProps {
  data: SecuritySettingsData;
  validationErrors: Record<string, string[]>;
  onUpdate: (data: SecuritySettingsData) => void;
}

export function SecuritySettings({
  data,
  validationErrors,
  onUpdate,
}: SecuritySettingsProps) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<SecuritySettingsData>({
    defaultValues: data,
  });

  const watchedValues = watch();

  const onSubmit = (formData: SecuritySettingsData) => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    Object.keys(data).forEach(key => {
      setValue(
        key as keyof SecuritySettingsData,
        data[key as keyof SecuritySettingsData]
      );
    });
  };

  const getFieldError = (fieldPath: string) => {
    return (
      validationErrors[fieldPath]?.[0] ||
      errors[fieldPath as keyof SecuritySettingsData]?.message
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Security & Access
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Configure authentication, permissions, and security policies
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
            <Button onClick={() => setIsEditing(true)}>Edit Security</Button>
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
        {/* Authentication */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Authentication
            </CardTitle>
            <CardDescription>
              Configure login methods and password policies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* SSO Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Single Sign-On (SSO)</Label>
                  <p className="text-sm text-gray-600">
                    Enable SSO authentication for your organization
                  </p>
                </div>
                <Switch
                  checked={watchedValues.authentication.ssoEnabled}
                  onCheckedChange={checked =>
                    setValue('authentication.ssoEnabled', checked)
                  }
                  disabled={!isEditing}
                />
              </div>

              {watchedValues.authentication.ssoEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="ssoProvider">SSO Provider</Label>
                    <Select
                      value={watchedValues.authentication.ssoProvider || ''}
                      onValueChange={value =>
                        setValue('authentication.ssoProvider', value as any)
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select SSO provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="saml">SAML</SelectItem>
                        <SelectItem value="oidc">OpenID Connect</SelectItem>
                        <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="entityId">Entity ID</Label>
                    <Input
                      id="entityId"
                      {...register('authentication.ssoConfig.entityId')}
                      disabled={!isEditing}
                      placeholder="your-entity-id"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ssoUrl">SSO URL</Label>
                    <Input
                      id="ssoUrl"
                      {...register('authentication.ssoConfig.ssoUrl')}
                      disabled={!isEditing}
                      placeholder="https://your-sso-provider.com/sso"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="certificate">Certificate</Label>
                    <Input
                      id="certificate"
                      {...register('authentication.ssoConfig.certificate')}
                      disabled={!isEditing}
                      placeholder="Paste your certificate here"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Two-Factor Authentication */}
            <div className="flex items-center justify-between">
              <div>
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-gray-600">
                  Require 2FA for all user accounts
                </p>
              </div>
              <Switch
                checked={watchedValues.authentication.twoFactorRequired}
                onCheckedChange={checked =>
                  setValue('authentication.twoFactorRequired', checked)
                }
                disabled={!isEditing}
              />
            </div>

            {/* Password Policy */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Password Policy</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minLength">Minimum Length</Label>
                  <Input
                    id="minLength"
                    type="number"
                    min="6"
                    max="32"
                    {...register('authentication.passwordPolicy.minLength', {
                      required: 'Minimum length is required',
                      min: { value: 6, message: 'Minimum length is 6' },
                      max: { value: 32, message: 'Maximum length is 32' },
                    })}
                    disabled={!isEditing}
                    className={
                      getFieldError('authentication.passwordPolicy.minLength')
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {getFieldError('authentication.passwordPolicy.minLength') && (
                    <p className="text-sm text-red-600">
                      {getFieldError('authentication.passwordPolicy.minLength')}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxAge">Max Age (days)</Label>
                  <Input
                    id="maxAge"
                    type="number"
                    min="30"
                    max="365"
                    {...register('authentication.passwordPolicy.maxAge', {
                      required: 'Max age is required',
                      min: { value: 30, message: 'Minimum 30 days' },
                      max: { value: 365, message: 'Maximum 365 days' },
                    })}
                    disabled={!isEditing}
                    className={
                      getFieldError('authentication.passwordPolicy.maxAge')
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {getFieldError('authentication.passwordPolicy.maxAge') && (
                    <p className="text-sm text-red-600">
                      {getFieldError('authentication.passwordPolicy.maxAge')}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Require Uppercase Letters</Label>
                  <Switch
                    checked={
                      watchedValues.authentication.passwordPolicy
                        .requireUppercase
                    }
                    onCheckedChange={checked =>
                      setValue(
                        'authentication.passwordPolicy.requireUppercase',
                        checked
                      )
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Require Lowercase Letters</Label>
                  <Switch
                    checked={
                      watchedValues.authentication.passwordPolicy
                        .requireLowercase
                    }
                    onCheckedChange={checked =>
                      setValue(
                        'authentication.passwordPolicy.requireLowercase',
                        checked
                      )
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Require Numbers</Label>
                  <Switch
                    checked={
                      watchedValues.authentication.passwordPolicy.requireNumbers
                    }
                    onCheckedChange={checked =>
                      setValue(
                        'authentication.passwordPolicy.requireNumbers',
                        checked
                      )
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Require Special Characters</Label>
                  <Switch
                    checked={
                      watchedValues.authentication.passwordPolicy
                        .requireSpecialChars
                    }
                    onCheckedChange={checked =>
                      setValue(
                        'authentication.passwordPolicy.requireSpecialChars',
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

        {/* Session Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Session Management
            </CardTitle>
            <CardDescription>
              Configure session timeouts and security policies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">
                  Session Timeout (minutes)
                </Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  min="15"
                  max="1440"
                  {...register('sessionManagement.sessionTimeout', {
                    required: 'Session timeout is required',
                    min: { value: 15, message: 'Minimum 15 minutes' },
                    max: { value: 1440, message: 'Maximum 24 hours' },
                  })}
                  defaultValue={data.sessionManagement?.sessionTimeout || 30}
                  disabled={!isEditing}
                  className={
                    getFieldError('sessionManagement.sessionTimeout')
                      ? 'border-red-500'
                      : ''
                  }
                />
                {getFieldError('sessionManagement.sessionTimeout') && (
                  <p className="text-sm text-red-600">
                    {getFieldError('sessionManagement.sessionTimeout')}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="concurrentSessionLimit">
                  Concurrent Session Limit
                </Label>
                <Input
                  id="concurrentSessionLimit"
                  type="number"
                  min="1"
                  max="10"
                  {...register('sessionManagement.concurrentSessionLimit', {
                    required: 'Session limit is required',
                    min: { value: 1, message: 'Minimum 1 session' },
                    max: { value: 10, message: 'Maximum 10 sessions' },
                  })}
                  defaultValue={
                    data.sessionManagement?.concurrentSessionLimit || 3
                  }
                  disabled={!isEditing}
                  className={
                    getFieldError('sessionManagement.concurrentSessionLimit')
                      ? 'border-red-500'
                      : ''
                  }
                />
                {getFieldError('sessionManagement.concurrentSessionLimit') && (
                  <p className="text-sm text-red-600">
                    {getFieldError('sessionManagement.concurrentSessionLimit')}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Remember Me</Label>
                <p className="text-sm text-gray-600">
                  Allow users to stay logged in across browser sessions
                </p>
              </div>
              <Switch
                checked={
                  watchedValues.sessionManagement?.rememberMeEnabled || false
                }
                onCheckedChange={checked =>
                  setValue('sessionManagement.rememberMeEnabled', checked)
                }
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        {/* Access Control */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Access Control
            </CardTitle>
            <CardDescription>
              Configure role-based access and permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Role-Based Access Control</Label>
                <p className="text-sm text-gray-600">
                  Enable role-based permissions for users
                </p>
              </div>
              <Switch
                checked={watchedValues.accessControl.roleBasedAccess}
                onCheckedChange={checked =>
                  setValue('accessControl.roleBasedAccess', checked)
                }
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>API Access Control</Label>
                <p className="text-sm text-gray-600">
                  Restrict API access based on user permissions
                </p>
              </div>
              <Switch
                checked={watchedValues.accessControl.apiAccessControl}
                onCheckedChange={checked =>
                  setValue('accessControl.apiAccessControl', checked)
                }
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Data Export Permissions</Label>
                <p className="text-sm text-gray-600">
                  Control who can export data from the system
                </p>
              </div>
              <Switch
                checked={watchedValues.accessControl.dataExportPermissions}
                onCheckedChange={checked =>
                  setValue('accessControl.dataExportPermissions', checked)
                }
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        {/* Audit Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Audit & Compliance
            </CardTitle>
            <CardDescription>
              Configure audit logging and compliance reporting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Audit Logging</Label>
                <p className="text-sm text-gray-600">
                  Log all user actions and system events
                </p>
              </div>
              <Switch
                checked={watchedValues.auditSettings?.auditLogging || false}
                onCheckedChange={checked =>
                  setValue('auditSettings.auditLogging', checked)
                }
                disabled={!isEditing}
              />
            </div>

            {watchedValues.auditSettings?.auditLogging && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="logRetentionDays">Log Retention (days)</Label>
                  <Input
                    id="logRetentionDays"
                    type="number"
                    min="30"
                    max="2555"
                    {...register('auditSettings.logRetentionDays', {
                      required: 'Log retention is required',
                      min: { value: 30, message: 'Minimum 30 days' },
                      max: { value: 2555, message: 'Maximum 7 years' },
                    })}
                    defaultValue={data.auditSettings?.logRetentionDays || 365}
                    disabled={!isEditing}
                    className={
                      getFieldError('auditSettings.logRetentionDays')
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {getFieldError('auditSettings.logRetentionDays') && (
                    <p className="text-sm text-red-600">
                      {getFieldError('auditSettings.logRetentionDays')}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Compliance Reporting</Label>
                    <p className="text-sm text-gray-600">
                      Generate compliance reports automatically
                    </p>
                  </div>
                  <Switch
                    checked={
                      watchedValues.auditSettings?.complianceReporting || false
                    }
                    onCheckedChange={checked =>
                      setValue('auditSettings.complianceReporting', checked)
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Data Anonymization</Label>
                    <p className="text-sm text-gray-600">
                      Anonymize sensitive data in audit logs
                    </p>
                  </div>
                  <Switch
                    checked={
                      watchedValues.auditSettings?.dataAnonymization || false
                    }
                    onCheckedChange={checked =>
                      setValue('auditSettings.dataAnonymization', checked)
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
