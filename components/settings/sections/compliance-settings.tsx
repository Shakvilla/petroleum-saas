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
import { Plus, Trash2, FileCheck, Shield, AlertTriangle } from 'lucide-react';
import type { ComplianceSettingsData } from '@/types/settings';

interface ComplianceSettingsProps {
  data: ComplianceSettingsData;
  validationErrors: Record<string, string[]>;
  onUpdate: (data: ComplianceSettingsData) => void;
}

export function ComplianceSettings({
  data,
  validationErrors,
  onUpdate,
}: ComplianceSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ComplianceSettingsData>({
    defaultValues: data,
  });

  const watchedValues = watch();

  const onSubmit = (formData: ComplianceSettingsData) => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    Object.keys(data).forEach(key => {
      setValue(
        key as keyof ComplianceSettingsData,
        data[key as keyof ComplianceSettingsData]
      );
    });
  };

  const getFieldError = (fieldPath: string) => {
    return (
      validationErrors[fieldPath]?.[0] ||
      errors[fieldPath as keyof ComplianceSettingsData]?.message
    );
  };

  const addAutomatedReport = () => {
    const newReport = {
      id: `report-${Date.now()}`,
      name: '',
      type: 'inventory' as const,
      schedule: '',
      recipients: [],
      format: 'pdf' as const,
      isActive: false,
    };
    setValue('reporting.automatedReports', [
      ...watchedValues.reporting.automatedReports,
      newReport,
    ]);
  };

  const removeAutomatedReport = (index: number) => {
    const reports = watchedValues.reporting.automatedReports.filter(
      (_, i) => i !== index
    );
    setValue('reporting.automatedReports', reports);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Compliance</h2>
          <p className="text-sm text-gray-600 mt-1">
            Configure regulatory standards, reporting, and safety protocols
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
            <Button onClick={() => setIsEditing(true)}>Edit Compliance</Button>
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
        {/* Regulatory Standards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Regulatory Standards
            </CardTitle>
            <CardDescription>
              Configure compliance with industry regulations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* EPA Compliance */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">
                    EPA Compliance
                  </Label>
                  <p className="text-sm text-gray-600">
                    Environmental Protection Agency regulations
                  </p>
                </div>
                <Switch
                  checked={watchedValues.regulatoryStandards.epa.enabled}
                  onCheckedChange={checked =>
                    setValue('regulatoryStandards.epa.enabled', checked)
                  }
                  disabled={!isEditing}
                />
              </div>

              {watchedValues.regulatoryStandards.epa.enabled && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="epaInspectionSchedule">
                      Inspection Schedule
                    </Label>
                    <Input
                      id="epaInspectionSchedule"
                      {...register(
                        'regulatoryStandards.epa.inspectionSchedule'
                      )}
                      disabled={!isEditing}
                      placeholder="e.g., Quarterly, Annually"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Required Documentation</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        'Spill Prevention',
                        'Emergency Response',
                        'Training Records',
                        'Equipment Maintenance',
                        'Environmental Monitoring',
                        'Waste Management',
                      ].map(doc => (
                        <div key={doc} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`epa-${doc}`}
                            checked={
                              watchedValues.regulatoryStandards?.epa?.documentationRequired?.includes(
                                doc
                              ) || false
                            }
                            onChange={e => {
                              const current =
                                watchedValues.regulatoryStandards?.epa
                                  ?.documentationRequired || [];
                              const updated = e.target.checked
                                ? [...current, doc]
                                : current.filter(item => item !== doc);
                              setValue(
                                'regulatoryStandards.epa.documentationRequired',
                                updated
                              );
                            }}
                            disabled={!isEditing}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={`epa-${doc}`} className="text-sm">
                            {doc}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* OSHA Compliance */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">
                    OSHA Compliance
                  </Label>
                  <p className="text-sm text-gray-600">
                    Occupational Safety and Health Administration regulations
                  </p>
                </div>
                <Switch
                  checked={watchedValues.regulatoryStandards.osha.enabled}
                  onCheckedChange={checked =>
                    setValue('regulatoryStandards.osha.enabled', checked)
                  }
                  disabled={!isEditing}
                />
              </div>

              {watchedValues.regulatoryStandards.osha.enabled && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="oshaInspectionSchedule">
                      Inspection Schedule
                    </Label>
                    <Input
                      id="oshaInspectionSchedule"
                      {...register(
                        'regulatoryStandards.osha.inspectionSchedule'
                      )}
                      disabled={!isEditing}
                      placeholder="e.g., Monthly, Quarterly"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Required Documentation</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        'Safety Training',
                        'Incident Reports',
                        'Equipment Inspections',
                        'Hazard Assessments',
                        'Emergency Procedures',
                        'Personal Protective Equipment',
                      ].map(doc => (
                        <div key={doc} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`osha-${doc}`}
                            checked={
                              watchedValues.regulatoryStandards?.osha?.documentationRequired?.includes(
                                doc
                              ) || false
                            }
                            onChange={e => {
                              const current =
                                watchedValues.regulatoryStandards?.osha
                                  ?.documentationRequired || [];
                              const updated = e.target.checked
                                ? [...current, doc]
                                : current.filter(item => item !== doc);
                              setValue(
                                'regulatoryStandards.osha.documentationRequired',
                                updated
                              );
                            }}
                            disabled={!isEditing}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={`osha-${doc}`} className="text-sm">
                            {doc}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* DOT Compliance */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">
                    DOT Compliance
                  </Label>
                  <p className="text-sm text-gray-600">
                    Department of Transportation regulations
                  </p>
                </div>
                <Switch
                  checked={watchedValues.regulatoryStandards.dot.enabled}
                  onCheckedChange={checked =>
                    setValue('regulatoryStandards.dot.enabled', checked)
                  }
                  disabled={!isEditing}
                />
              </div>

              {watchedValues.regulatoryStandards.dot.enabled && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="dotInspectionSchedule">
                      Inspection Schedule
                    </Label>
                    <Input
                      id="dotInspectionSchedule"
                      {...register(
                        'regulatoryStandards.dot.inspectionSchedule'
                      )}
                      disabled={!isEditing}
                      placeholder="e.g., Pre-trip, Post-trip, Annual"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Required Documentation</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        'Driver Logs',
                        'Vehicle Inspections',
                        'Hazardous Materials',
                        'Hours of Service',
                        'Drug Testing',
                        'Vehicle Maintenance',
                      ].map(doc => (
                        <div key={doc} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`dot-${doc}`}
                            checked={
                              watchedValues.regulatoryStandards?.dot?.documentationRequired?.includes(
                                doc
                              ) || false
                            }
                            onChange={e => {
                              const current =
                                watchedValues.regulatoryStandards?.dot
                                  ?.documentationRequired || [];
                              const updated = e.target.checked
                                ? [...current, doc]
                                : current.filter(item => item !== doc);
                              setValue(
                                'regulatoryStandards.dot.documentationRequired',
                                updated
                              );
                            }}
                            disabled={!isEditing}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={`dot-${doc}`} className="text-sm">
                            {doc}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Reporting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Automated Reporting
            </CardTitle>
            <CardDescription>
              Configure automated compliance reports
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Automated Reports</h4>
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAutomatedReport}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Report
                </Button>
              )}
            </div>

            {watchedValues.reporting.automatedReports.map((report, index) => (
              <div
                key={report.id}
                className="p-4 border border-gray-200 rounded-lg space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h5 className="font-medium">Report {index + 1}</h5>
                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeAutomatedReport(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`report-name-${index}`}>Report Name</Label>
                    <Input
                      id={`report-name-${index}`}
                      {...register(`reporting.automatedReports.${index}.name`)}
                      disabled={!isEditing}
                      placeholder="e.g., Monthly Inventory Report"
                      className={
                        getFieldError(
                          `reporting.automatedReports.${index}.name`
                        )
                          ? 'border-red-500'
                          : ''
                      }
                    />
                    {getFieldError(
                      `reporting.automatedReports.${index}.name`
                    ) && (
                      <p className="text-sm text-red-600">
                        {getFieldError(
                          `reporting.automatedReports.${index}.name`
                        )}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`report-type-${index}`}>Report Type</Label>
                    <Select
                      value={report.type}
                      onValueChange={value =>
                        setValue(
                          `reporting.automatedReports.${index}.type`,
                          value as any
                        )
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inventory">Inventory</SelectItem>
                        <SelectItem value="delivery">Delivery</SelectItem>
                        <SelectItem value="safety">Safety</SelectItem>
                        <SelectItem value="compliance">Compliance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`report-schedule-${index}`}>Schedule</Label>
                    <Input
                      id={`report-schedule-${index}`}
                      {...register(
                        `reporting.automatedReports.${index}.schedule`
                      )}
                      disabled={!isEditing}
                      placeholder="e.g., Monthly on 1st, Weekly on Monday"
                      className={
                        getFieldError(
                          `reporting.automatedReports.${index}.schedule`
                        )
                          ? 'border-red-500'
                          : ''
                      }
                    />
                    {getFieldError(
                      `reporting.automatedReports.${index}.schedule`
                    ) && (
                      <p className="text-sm text-red-600">
                        {getFieldError(
                          `reporting.automatedReports.${index}.schedule`
                        )}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`report-format-${index}`}>Format</Label>
                    <Select
                      value={report.format}
                      onValueChange={value =>
                        setValue(
                          `reporting.automatedReports.${index}.format`,
                          value as any
                        )
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`report-recipients-${index}`}>
                    Recipients (comma-separated emails)
                  </Label>
                  <Input
                    id={`report-recipients-${index}`}
                    {...register(
                      `reporting.automatedReports.${index}.recipients`
                    )}
                    disabled={!isEditing}
                    placeholder="admin@company.com, manager@company.com"
                    className={
                      getFieldError(
                        `reporting.automatedReports.${index}.recipients`
                      )
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {getFieldError(
                    `reporting.automatedReports.${index}.recipients`
                  ) && (
                    <p className="text-sm text-red-600">
                      {getFieldError(
                        `reporting.automatedReports.${index}.recipients`
                      )}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Label>Active</Label>
                  <Switch
                    checked={report.isActive}
                    onCheckedChange={checked =>
                      setValue(
                        `reporting.automatedReports.${index}.isActive`,
                        checked
                      )
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Data Retention
            </CardTitle>
            <CardDescription>
              Configure data retention policies for compliance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataType">Data Type</Label>
                <Select
                  value={watchedValues.reporting.dataRetention.dataType}
                  onValueChange={value =>
                    setValue('reporting.dataRetention.dataType', value)
                  }
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Data</SelectItem>
                    <SelectItem value="financial">Financial Records</SelectItem>
                    <SelectItem value="safety">Safety Records</SelectItem>
                    <SelectItem value="compliance">
                      Compliance Records
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="retentionPeriod">Retention Period</Label>
                <Input
                  id="retentionPeriod"
                  type="number"
                  min="1"
                  {...register('reporting.dataRetention.retentionPeriod', {
                    required: 'Retention period is required',
                    min: { value: 1, message: 'Must be at least 1' },
                  })}
                  disabled={!isEditing}
                  className={
                    getFieldError('reporting.dataRetention.retentionPeriod')
                      ? 'border-red-500'
                      : ''
                  }
                />
                {getFieldError('reporting.dataRetention.retentionPeriod') && (
                  <p className="text-sm text-red-600">
                    {getFieldError('reporting.dataRetention.retentionPeriod')}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="retentionUnit">Retention Unit</Label>
                <Select
                  value={watchedValues.reporting.dataRetention.unit}
                  onValueChange={value =>
                    setValue('reporting.dataRetention.unit', value as any)
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
                <Label htmlFor="retentionAction">Action</Label>
                <Select
                  value={watchedValues.reporting.dataRetention.action}
                  onValueChange={value =>
                    setValue('reporting.dataRetention.action', value as any)
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
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
