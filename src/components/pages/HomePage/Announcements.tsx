"use client";

import React from "react";
import { useGetActiveAnnouncementsQuery } from "@/store/api/userApi";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  AlertTriangle, 
  Bell, 
  Calendar, 
  Car, 
  GraduationCap, 
  Info,
  ChevronRight,
  Clock,
  Users
} from "lucide-react";
import Link from "next/link";
import SmallTitle from "@/components/SmallTitle";

const Announcements = () => {
  const { data: announcements, isLoading, error } = useGetActiveAnnouncementsQuery({
    limit: 6,
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400";
      case "HIGH":
        return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "LOW":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "EMERGENCY":
        return <AlertTriangle className="h-5 w-5" />;
      case "ACADEMIC":
        return <GraduationCap className="h-5 w-5" />;
      case "TRANSPORT":
        return <Car className="h-5 w-5" />;
      case "EVENT":
        return <Calendar className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "EMERGENCY":
        return "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400";
      case "ACADEMIC":
        return "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400";
      case "TRANSPORT":
        return "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400";
      case "EVENT":
        return "text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400";
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  if (error) {
    return null; // Don't show anything if there's an error
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <SmallTitle title="Latest Announcements" className="mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Stay Updated with School News
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Important updates, emergency notices, and school events - all in one place
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="h-64">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : announcements && announcements.length > 0 ? (
          <>
            {/* Emergency Announcements - Full Width */}
            {announcements.filter(a => a.priority === "URGENT" || a.type === "EMERGENCY").length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Emergency Notices
                </h3>
                <div className="space-y-4">
                  {announcements
                    .filter(a => a.priority === "URGENT" || a.type === "EMERGENCY")
                    .map((announcement) => (
                      <Card 
                        key={announcement.id} 
                        className="border-l-4 border-red-500 bg-red-50 dark:bg-red-900/10 hover:shadow-lg transition-all duration-200"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className={`p-2 rounded-full ${getTypeColor(announcement.type)}`}>
                                  {getTypeIcon(announcement.type)}
                                </div>
                                <div>
                                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {announcement.title}
                                  </h4>
                                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <Clock className="h-4 w-4" />
                                    {formatTimeAgo(announcement.publishDate)}
                                  </div>
                                </div>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                                {announcement.content}
                              </p>
                              <div className="flex items-center gap-2">
                                <Badge className={getPriorityColor(announcement.priority)}>
                                  {announcement.priority}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {announcement.type}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            )}

            {/* Regular Announcements - Grid Layout */}
            {announcements.filter(a => a.priority !== "URGENT" && a.type !== "EMERGENCY").length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  General Announcements
                </h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {announcements
                    .filter(a => a.priority !== "URGENT" && a.type !== "EMERGENCY")
                    .map((announcement) => (
                      <Card 
                        key={announcement.id} 
                        className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md bg-white dark:bg-gray-800"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className={`p-2 rounded-lg ${getTypeColor(announcement.type)}`}>
                              {getTypeIcon(announcement.type)}
                            </div>
                            <Badge className={getPriorityColor(announcement.priority)} variant="outline">
                              {announcement.priority}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                            {announcement.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="h-4 w-4" />
                            {formatTimeAgo(announcement.publishDate)}
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 mb-4">
                            {announcement.content}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <Users className="h-3 w-3" />
                              {announcement.targetAudience.join(", ")}
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-0 h-auto font-medium"
                            >
                              Read more
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            )}

            {/* View All Button */}
            <div className="text-center mt-12">
              <Button 
                asChild 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Link href="/dashboard/announcements">
                  View All Announcements
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Bell className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Announcements
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              There are no active announcements at the moment. Check back later for updates.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Announcements; 