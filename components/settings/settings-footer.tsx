'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Save, RotateCcw, X, AlertTriangle, CheckCircle } from 'lucide-react';

interface SettingsFooterProps {
  hasUnsavedChanges: boolean;
  validationErrors: Record<string, string[]>;
  isSaving: boolean;
  onSave: () => void;
  onReset: () => void;
  onCancel: () => void;
}

export function SettingsFooter({
  hasUnsavedChanges,
  validationErrors,
  isSaving,
  onSave,
  onReset,
  onCancel,
}: SettingsFooterProps) {
  const hasValidationErrors = Object.keys(validationErrors).length > 0;
  const errorCount = Object.keys(validationErrors).length;

  return (
    <div className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Status */}
        <div className="flex items-center gap-4">
          {hasUnsavedChanges ? (
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-amber-600">
                You have unsaved changes
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600">All changes saved</span>
            </div>
          )}

          {hasValidationErrors && (
            <Badge variant="destructive" className="text-xs">
              {errorCount} error{errorCount !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                disabled={isSaving}
                className="text-gray-600 hover:text-gray-900"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                disabled={isSaving}
                className="text-gray-600 hover:text-gray-900"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </>
          )}

          <Separator orientation="vertical" className="h-6" />

          <Button
            onClick={onSave}
            disabled={!hasUnsavedChanges || isSaving || hasValidationErrors}
            size="sm"
            className="min-w-[100px]"
          >
            {isSaving ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Validation Errors Summary */}
      {hasValidationErrors && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-sm text-red-600">
            <strong>Please fix the following errors:</strong>
            <ul className="mt-1 list-disc list-inside space-y-1">
              {Object.entries(validationErrors)
                .slice(0, 3)
                .map(([field, messages]) => (
                  <li key={field}>
                    {field}: {messages[0]}
                  </li>
                ))}
              {errorCount > 3 && (
                <li className="text-gray-500">
                  ... and {errorCount - 3} more error
                  {errorCount - 3 !== 1 ? 's' : ''}
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
