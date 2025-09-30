'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface SettingsErrorProps {
  error: string;
  onRetry: () => void;
}

export function SettingsError({ error, onRetry }: SettingsErrorProps) {
  return (
    <div className="flex h-full bg-gray-50 items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Settings Error
          </CardTitle>
          <CardDescription className="text-gray-600">
            There was a problem loading your settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-red-50 p-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={onRetry} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>

            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Reload Page
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              If the problem persists, please contact support
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
