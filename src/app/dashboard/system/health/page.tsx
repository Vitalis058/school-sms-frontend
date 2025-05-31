"use client";

import React from "react";
import {
  Activity,
  Database,
  Server,
  Wifi,
  HardDrive,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarInset } from "@/components/ui/sidebar";
import { usePermissions } from "@/contexts/AuthContext";
import { useGetSystemHealthQuery, useGetSystemLogsQuery } from "@/store/api/systemApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SystemHealthPage() {
  const { isAdmin } = usePermissions();
  const { data: healthResponse, isLoading, error, refetch } = useGetSystemHealthQuery();
  const { data: logsResponse } = useGetSystemLogsQuery({ limit: 10 });

  const health = healthResponse?.data;
  const logs = logsResponse?.data || [];

  if (!isAdmin()) {
    return (
      <SidebarInset>
        <div className="flex-1 space-y-6 p-6">
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Access Restricted</h3>
            <p className="text-muted-foreground">
              Only administrators can access system health monitoring.
            </p>
          </div>
        </div>
      </SidebarInset>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy":
      case "operational":
      case "connected":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "error":
      case "failed":
      case "disconnected":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy":
      case "operational":
      case "connected":
        return <Badge className="bg-green-100 text-green-800">Healthy</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case "error":
      case "failed":
      case "disconnected":
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const formatMemory = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "ERROR":
        return <Badge variant="destructive">Error</Badge>;
      case "WARN":
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case "INFO":
        return <Badge variant="secondary">Info</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  return (
    <SidebarInset>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">System Health</h2>
            <p className="text-muted-foreground">
              Monitor system performance and service status
            </p>
          </div>
          <Button onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading system health...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Error Loading Health Data</h3>
            <p className="text-muted-foreground">
              Failed to load system health information. Please try again.
            </p>
          </div>
        ) : health ? (
          <>
            {/* System Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Status</CardTitle>
                  {getStatusIcon(health.status)}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{health.status}</div>
                  <p className="text-xs text-muted-foreground">
                    Version {health.version}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatUptime(health.uptime)}</div>
                  <p className="text-xs text-muted-foreground">
                    Since last restart
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatMemory(health.memory.heapUsed)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    of {formatMemory(health.memory.heapTotal)} allocated
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Database</CardTitle>
                  {getStatusIcon(health.database.status)}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{health.database.status}</div>
                  <p className="text-xs text-muted-foreground">
                    {health.database.responseTime.toFixed(1)}ms response
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Services Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Services Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(health.services).map(([service, status]) => (
                    <div key={service} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(status)}
                        <div>
                          <div className="font-medium capitalize">{service}</div>
                          <div className="text-sm text-muted-foreground">
                            {status === "operational" ? "Running normally" : 
                             status === "disabled" ? "Service disabled" : "Service issue"}
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Maintenance Status */}
            {health.maintenanceMode && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-800">
                    <AlertTriangle className="h-5 w-5" />
                    Maintenance Mode Active
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-yellow-700">
                    The system is currently in maintenance mode. Some features may be unavailable.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Recent System Logs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Recent System Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {logs.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Message</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="text-sm">
                            {new Date(log.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {getLevelBadge(log.level)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{log.category}</Badge>
                          </TableCell>
                          <TableCell className="max-w-md truncate">
                            {log.message}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent logs available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* System Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  System Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Last Backup:</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(health.lastBackup).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">System Version:</span>
                      <span className="text-sm text-muted-foreground">{health.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Node.js Version:</span>
                      <span className="text-sm text-muted-foreground">Server-side</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Memory Heap Total:</span>
                      <span className="text-sm text-muted-foreground">
                        {formatMemory(health.memory.heapTotal)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Memory Heap Used:</span>
                      <span className="text-sm text-muted-foreground">
                        {formatMemory(health.memory.heapUsed)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">External Memory:</span>
                      <span className="text-sm text-muted-foreground">
                        {formatMemory(health.memory.external)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </SidebarInset>
  );
}