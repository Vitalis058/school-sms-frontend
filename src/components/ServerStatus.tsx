"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, Server, Wifi, WifiOff, Bug, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ServerStatusProps {
  children: React.ReactNode;
}

interface ServerHealth {
  backend: boolean;
  database: boolean;
  lastChecked: Date;
  responseTime: number | null;
  error: string | null;
}

export function ServerStatus({ children }: ServerStatusProps) {
  const [serverHealth, setServerHealth] = useState<ServerHealth>({
    backend: false,
    database: false,
    lastChecked: new Date(),
    responseTime: null,
    error: null,
  });
  const [showDebug, setShowDebug] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const checkServerHealth = async () => {
    setIsChecking(true);
    const startTime = Date.now();
    
    try {
      const response = await fetch("http://localhost:8000/api/health", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        const data = await response.json();
        setServerHealth({
          backend: true,
          database: data.database || false,
          lastChecked: new Date(),
          responseTime,
          error: null,
        });
      } else {
        throw new Error(`Server responded with status: ${response.status}`);
      }
    } catch (error: any) {
      setServerHealth({
        backend: false,
        database: false,
        lastChecked: new Date(),
        responseTime: null,
        error: error.message || "Connection failed",
      });
    } finally {
      setIsChecking(false);
    }
  };

  // Check server health on mount and every 30 seconds
  useEffect(() => {
    checkServerHealth();
    const interval = setInterval(checkServerHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  // Show server down UI if backend is not running
  if (!serverHealth.backend) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Server className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Server Unavailable
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Unable to connect to the backend server. Please ensure the server is running on port 8000.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Backend Server:</span>
                <Badge variant="destructive" className="flex items-center gap-1">
                  <WifiOff className="w-3 h-3" />
                  Offline
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Last Checked:</span>
                <span className="text-gray-500">
                  {serverHealth.lastChecked.toLocaleTimeString()}
                </span>
              </div>
              {serverHealth.error && (
                <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                  Error: {serverHealth.error}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={checkServerHealth} 
                disabled={isChecking}
                className="flex-1"
              >
                {isChecking ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Retry Connection
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowDebug(!showDebug)}
              >
                <Bug className="w-4 h-4" />
              </Button>
            </div>

            {showDebug && (
              <DebugWindow 
                serverHealth={serverHealth} 
                onClose={() => setShowDebug(false)} 
              />
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show debug window toggle when server is running
  return (
    <div className="relative">
      {children}
      
      {/* Debug toggle button */}
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 shadow-lg"
        onClick={() => setShowDebug(!showDebug)}
      >
        <Bug className="w-4 h-4 mr-1" />
        Debug
      </Button>

      {/* Debug window overlay */}
      {showDebug && (
        <DebugWindow 
          serverHealth={serverHealth} 
          onClose={() => setShowDebug(false)} 
        />
      )}
    </div>
  );
}

interface DebugWindowProps {
  serverHealth: ServerHealth;
  onClose: () => void;
}

function DebugWindow({ serverHealth, onClose }: DebugWindowProps) {
  const [logs, setLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] Debug window opened`,
    `[${serverHealth.lastChecked.toLocaleTimeString()}] Server health check completed`,
  ]);

  useEffect(() => {
    const newLog = `[${new Date().toLocaleTimeString()}] Backend: ${serverHealth.backend ? 'Online' : 'Offline'}`;
    setLogs(prev => [...prev.slice(-9), newLog]); // Keep last 10 logs
  }, [serverHealth]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Bug className="w-5 h-5" />
            Debug Information
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Server Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Server Status</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span>Backend:</span>
                  <Badge variant={serverHealth.backend ? "default" : "destructive"}>
                    {serverHealth.backend ? "Online" : "Offline"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Database:</span>
                  <Badge variant={serverHealth.database ? "default" : "destructive"}>
                    {serverHealth.database ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Response Time:</span>
                  <span className="text-gray-600">
                    {serverHealth.responseTime ? `${serverHealth.responseTime}ms` : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Environment</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span>Frontend URL:</span>
                  <span className="text-gray-600">localhost:3000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Backend URL:</span>
                  <span className="text-gray-600">localhost:8000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Mode:</span>
                  <span className="text-gray-600">Development</span>
                </div>
              </div>
            </div>
          </div>

          {/* Error Information */}
          {serverHealth.error && (
            <div className="space-y-2">
              <h4 className="font-medium text-red-600">Error Details</h4>
              <div className="bg-red-50 p-3 rounded text-sm text-red-700">
                {serverHealth.error}
              </div>
            </div>
          )}

          {/* Logs */}
          <div className="space-y-2">
            <h4 className="font-medium">Recent Logs</h4>
            <div className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono max-h-32 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index}>{log}</div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button size="sm" onClick={() => window.location.reload()}>
              Reload Page
            </Button>
            <Button size="sm" variant="outline" onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(serverHealth, null, 2));
            }}>
              Copy Debug Info
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 