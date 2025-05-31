"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  RotateCcw,
  Eye,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarInset } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetMyBooksQuery,
  useRenewBookMutation,
} from "@/store/api/libraryApi";
import { useAuth, usePermissions } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function MyBooksPage() {
  const { user } = useAuth();
  const { isStudent, isTeacher } = usePermissions();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // API hooks
  const { data: myBooksResponse, isLoading, error } = useGetMyBooksQuery({
    userId: user?.id?.toString() || "",
    status: statusFilter === "all" ? undefined : statusFilter,
  });
  const [renewBook, { isLoading: isRenewing }] = useRenewBookMutation();

  // Extract data from response
  const myBooks = myBooksResponse?.data || [];

  // Handle renew book
  const handleRenewBook = async (issueId: string) => {
    try {
      // Calculate new due date (extend by same period)
      const newDueDate = new Date();
      newDueDate.setDate(newDueDate.getDate() + 14); // Default 14 days extension

      await renewBook({ 
        bookIssueId: issueId,
        newDueDate: newDueDate.toISOString(),
      }).unwrap();
      toast.success("Book renewed successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to renew book");
    }
  };

  // Calculate days until due or overdue
  const calculateDaysUntilDue = (dueDate: string): { days: number; isOverdue: boolean } => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return {
      days: Math.abs(diffDays),
      isOverdue: diffDays < 0,
    };
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ISSUED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "RETURNED":
        return "bg-green-100 text-green-800 border-green-200";
      case "OVERDUE":
        return "bg-red-100 text-red-800 border-red-200";
      case "LOST":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "DAMAGED":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get due date color
  const getDueDateColor = (dueDate: string, status: string) => {
    if (status === "RETURNED") return "text-muted-foreground";
    
    const { days, isOverdue } = calculateDaysUntilDue(dueDate);
    
    if (isOverdue) return "text-red-600";
    if (days <= 3) return "text-orange-600";
    if (days <= 7) return "text-yellow-600";
    return "text-muted-foreground";
  };

  // Filter books
  const filteredBooks = myBooks.filter((issue) => {
    const matchesSearch = 
      issue.Book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.Book?.author?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Separate current and history
  const currentBooks = filteredBooks.filter(issue => 
    issue.status === "ISSUED" || issue.status === "OVERDUE"
  );
  const bookHistory = filteredBooks.filter(issue => 
    issue.status === "RETURNED" || issue.status === "LOST" || issue.status === "DAMAGED"
  );

  // Calculate statistics
  const totalBorrowed = myBooks.filter(issue => 
    issue.status === "ISSUED" || issue.status === "OVERDUE"
  ).length;
  const overdueCount = myBooks.filter(issue => issue.status === "OVERDUE").length;
  const totalFines = myBooks.reduce((sum, issue) => sum + (issue.fineAmount || 0), 0);
  const booksReturned = myBooks.filter(issue => issue.status === "RETURNED").length;

  if (!isStudent() && !isTeacher()) {
    return (
      <SidebarInset>
        <div className="flex-1 space-y-6 p-6">
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Access Restricted</h3>
            <p className="text-muted-foreground">
              This page is only available for students and teachers.
            </p>
          </div>
        </div>
      </SidebarInset>
    );
  }

  return (
    <SidebarInset>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">My Books</h2>
            <p className="text-muted-foreground">
              View your borrowed books and borrowing history
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Currently Borrowed</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBorrowed}</div>
              <p className="text-xs text-muted-foreground">Active borrowings</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
              <p className="text-xs text-muted-foreground">Need to return</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fines</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalFines.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Outstanding fines</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Books Returned</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{booksReturned}</div>
              <p className="text-xs text-muted-foreground">Total returned</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by book title or author..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ISSUED">Currently Borrowed</SelectItem>
                  <SelectItem value="OVERDUE">Overdue</SelectItem>
                  <SelectItem value="RETURNED">Returned</SelectItem>
                  <SelectItem value="LOST">Lost</SelectItem>
                  <SelectItem value="DAMAGED">Damaged</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Books Table with Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>My Books</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="current" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="current">
                  Current Books ({currentBooks.length})
                </TabsTrigger>
                <TabsTrigger value="history">
                  History ({bookHistory.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="current" className="mt-4">
                <MyBooksTable 
                  books={currentBooks}
                  isLoading={isLoading}
                  error={error}
                  onRenew={handleRenewBook}
                  isRenewing={isRenewing}
                  getStatusColor={getStatusColor}
                  getDueDateColor={getDueDateColor}
                  calculateDaysUntilDue={calculateDaysUntilDue}
                  showActions={true}
                />
              </TabsContent>
              
              <TabsContent value="history" className="mt-4">
                <MyBooksTable 
                  books={bookHistory}
                  isLoading={isLoading}
                  error={error}
                  onRenew={handleRenewBook}
                  isRenewing={isRenewing}
                  getStatusColor={getStatusColor}
                  getDueDateColor={getDueDateColor}
                  calculateDaysUntilDue={calculateDaysUntilDue}
                  showActions={false}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}

// My Books Table Component
interface MyBooksTableProps {
  books: any[];
  isLoading: boolean;
  error: any;
  onRenew: (issueId: string) => void;
  isRenewing: boolean;
  getStatusColor: (status: string) => string;
  getDueDateColor: (dueDate: string, status: string) => string;
  calculateDaysUntilDue: (dueDate: string) => { days: number; isOverdue: boolean };
  showActions: boolean;
}

function MyBooksTable({ 
  books, 
  isLoading, 
  error, 
  onRenew, 
  isRenewing,
  getStatusColor,
  getDueDateColor,
  calculateDaysUntilDue,
  showActions
}: MyBooksTableProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading your books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
        <p>Error loading your books</p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <BookOpen className="h-8 w-8 mx-auto mb-2" />
        <p>No books found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Book</TableHead>
          <TableHead>Issue Date</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Renewals</TableHead>
          {showActions && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {books.map((issue) => {
          const { days, isOverdue } = calculateDaysUntilDue(issue.dueDate);
          return (
            <TableRow key={issue.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{issue.Book?.title}</div>
                  <div className="text-sm text-muted-foreground">
                    by {issue.Book?.author}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {new Date(issue.issueDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className={getDueDateColor(issue.dueDate, issue.status)}>
                    {new Date(issue.dueDate).toLocaleDateString()}
                  </span>
                  {issue.status !== "RETURNED" && (
                    <div className="text-xs">
                      {isOverdue ? (
                        <span className="text-red-600">({days} days overdue)</span>
                      ) : (
                        <span className="text-muted-foreground">({days} days left)</span>
                      )}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(issue.status)}>
                  {issue.status}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {issue.renewalCount}/{issue.maxRenewals}
                </span>
              </TableCell>
              {showActions && (
                <TableCell>
                  <div className="flex items-center gap-2">
                    {(issue.status === "ISSUED" || issue.status === "OVERDUE") && 
                     issue.renewalCount < issue.maxRenewals && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRenew(issue.id)}
                        disabled={isRenewing}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Renew
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
} 