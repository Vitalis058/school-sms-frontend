"use client";

import React from "react";
import { 
  Book, 
  BookOpen, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  Plus,
  Search,
  Filter,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarInset } from "@/components/ui/sidebar";
import { useGetLibraryAnalyticsQuery } from "@/store/api/libraryApi";
import { usePermissions } from "@/contexts/AuthContext";
import Link from "next/link";

export default function LibraryPage() {
  const { isAdmin, isLibrarian, isTeacher, isStudent } = usePermissions();
  const { data: libraryAnalytics, isLoading, error } = useGetLibraryAnalyticsQuery();

  const libraryData = libraryAnalytics?.data;
  const overdueBooks = libraryData?.overdueBooks ?? 0;
  const totalFines = libraryData?.totalFines ?? 0;
  const collectedFines = libraryData?.collectedFines ?? 0;
  const pendingFines = totalFines - collectedFines;

  const getWelcomeMessage = () => {
    if (isLibrarian()) {
      return "Manage your library efficiently with comprehensive tools and analytics.";
    } else if (isTeacher()) {
      return "Access library resources and manage your borrowed books.";
    } else if (isStudent()) {
      return "Discover books and manage your library account.";
    } else {
      return "Overview of library operations and resources.";
    }
  };

  const getQuickActions = () => {
    if (isAdmin() || isLibrarian()) {
      return [
        {
          title: "Manage Books",
          description: "Add, edit, or remove books from the collection",
          href: "/dashboard/library/books",
          icon: Book,
          color: "bg-blue-500",
        },
        {
          title: "Issue/Return Books",
          description: "Process book issues and returns",
          href: "/dashboard/library/issues",
          icon: BookOpen,
          color: "bg-green-500",
        },
        {
          title: "Manage Members",
          description: "Add or manage library members",
          href: "/dashboard/library/members",
          icon: Users,
          color: "bg-purple-500",
        },
        {
          title: "Overdue Books",
          description: "View and manage overdue books",
          href: "/dashboard/library/overdue",
          icon: AlertTriangle,
          color: "bg-red-500",
        },
      ];
    } else {
      return [
        {
          title: "Browse Books",
          description: "Search and discover available books",
          href: "/dashboard/library/books",
          icon: Search,
          color: "bg-blue-500",
        },
        {
          title: "My Books",
          description: "View your currently borrowed books",
          href: "/dashboard/library/my-books",
          icon: BookOpen,
          color: "bg-green-500",
        },
        {
          title: "Book History",
          description: "View your borrowing history",
          href: "/dashboard/library/history",
          icon: Calendar,
          color: "bg-purple-500",
        },
        {
          title: "Recommendations",
          description: "Discover recommended books",
          href: "/dashboard/library/recommendations",
          icon: TrendingUp,
          color: "bg-orange-500",
        },
      ];
    }
  };

  const quickActions = getQuickActions();

  return (
    <SidebarInset>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Library</h2>
            <p className="text-muted-foreground">
              {getWelcomeMessage()}
            </p>
          </div>
          {(isAdmin() || isLibrarian()) && (
            <Button asChild>
              <Link href="/dashboard/library/books">
                <Plus className="mr-2 h-4 w-4" />
                Add New Book
              </Link>
            </Button>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Books</CardTitle>
              <Book className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-2xl font-bold">Loading...</div>
              ) : (
                <div className="text-2xl font-bold">
                  {libraryData?.totalBooks?.toLocaleString() || "0"}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Books in collection
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Books</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-2xl font-bold">Loading...</div>
              ) : (
                <div className="text-2xl font-bold">
                  {libraryData?.availableBooks?.toLocaleString() || "0"}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Ready to issue
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-2xl font-bold">Loading...</div>
              ) : (
                <div className="text-2xl font-bold">
                  {libraryData?.activeMembers?.toLocaleString() || "0"}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Library members
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-2xl font-bold">Loading...</div>
              ) : (
                <div className="text-2xl font-bold">
                  {overdueBooks.toLocaleString()}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Need attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <p className="text-muted-foreground text-sm">
              Frequently used library functions
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-3"
                    asChild
                  >
                    <Link href={action.href}>
                      <div className={`p-2 rounded-lg ${action.color}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {action.description}
                        </div>
                      </div>
                    </Link>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Library Analytics for Admin/Librarian */}
        {(isAdmin() || isLibrarian()) && (
          <>
            {/* Financial Overview */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Financial Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Fines</span>
                      <span className="text-lg font-bold">${totalFines.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Collected</span>
                      <span className="text-lg font-bold text-green-600">
                        ${collectedFines.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Pending</span>
                      <span className="text-lg font-bold text-red-600">
                        ${pendingFines.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Books Issued Today</span>
                      <Badge variant="outline">
                        {libraryData?.monthlyIssues?.[0]?.issues || 0}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Books Returned Today</span>
                      <Badge variant="outline">
                        {libraryData?.monthlyIssues?.[0]?.returns || 0}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">New Members This Month</span>
                      <Badge variant="outline">5</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Popular Books */}
            {libraryData?.popularBooks && libraryData.popularBooks.length > 0 && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Popular Books</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/library/reports">
                      View All Reports
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {libraryData.popularBooks.slice(0, 5).map((book: any, index: number) => (
                      <div key={book.bookId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{book.title}</div>
                          <div className="text-sm text-muted-foreground">by {book.author}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{book.issueCount} issues</div>
                          <div className="text-xs text-muted-foreground">This month</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Error State */}
        {error && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Unable to Load Library Data</h3>
                <p className="text-muted-foreground">
                  There was an error loading the library analytics. Please try again later.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </SidebarInset>
  );
} 