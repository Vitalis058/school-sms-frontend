"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, Car } from "lucide-react";

interface TransportSettingsProps {
  settings: any;
  onUpdate: (data: any) => void;
  isLoading: boolean;
}

export default function TransportSettings({ settings, onUpdate, isLoading }: TransportSettingsProps) {
  const [formData, setFormData] = useState({
    maxCapacityPerVehicle: 50,
    bookingAdvanceDays: 7,
    gpsTracking: true,
    parentNotifications: true,
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Transport Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxCapacityPerVehicle">Max Capacity Per Vehicle</Label>
              <Input
                id="maxCapacityPerVehicle"
                type="number"
                value={formData.maxCapacityPerVehicle}
                onChange={(e) => handleInputChange("maxCapacityPerVehicle", parseInt(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bookingAdvanceDays">Booking Advance Days</Label>
              <Input
                id="bookingAdvanceDays"
                type="number"
                value={formData.bookingAdvanceDays}
                onChange={(e) => handleInputChange("bookingAdvanceDays", parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>GPS Tracking</Label>
              <p className="text-xs text-muted-foreground">
                Enable GPS tracking for vehicles
              </p>
            </div>
            <Switch
              checked={formData.gpsTracking}
              onCheckedChange={(checked) => handleInputChange("gpsTracking", checked)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Transport Settings
            </>
          )}
        </Button>
      </div>
    </form>
  );
} 