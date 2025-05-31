"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  Search,
  Filter,
  Calendar,
  User,
  DollarSign,
  Clock,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Eye,
  CreditCard,
  FileText,
  Download,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SidebarInset } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetOverdueBooksQuery,
  useReturnBookMutation,
  usePayFineMutation,
  useRenewBookMutation,
} from "@/store/api/libraryApi";
import { usePermissions } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface PayFineFormData {
  issueId: string;
  amount: number;
  paymentMethod: string;
  notes: string;
}

export default function OverduePage() {
  const { isAdmin, isLibrarian } = usePermissions();
  const [searchTerm, setSearchTerm] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState<string>("all");
  const [fineRangeFilter, setFineRangeFilter] = useState<string>("all");
  const [isPayFineDialogOpen, setIsPayFineDialogOpen] = useState(false);
  const [selectedOverdueIssue, setSelectedOverdueIssue] = useState<any>(null);

  // API hooks
  const { data: overdueResponse, isLoading, error } = useGetOverdueBooksQuery({});
  const [returnBook, { isLoading: isReturning }] = useReturnBookMutation();
  const [payFine, { isLoading: isPayingFine }] = usePayFineMutation();
  const [renewBook, { isLoading: isRenewing }] = useRenewBookMutation();

  // Extract data from response
  const overdueBooks = overdueResponse?.data || [];

  // Form state
  const [payFineFormData, setPayFineFormData] = useState<PayFineFormData>({
    issueId: "",
    amount: 0,
    paymentMethod: "CASH",
    notes: "",
  });

  // Calculate days overdue
  const calculateDaysOverdue = (dueDate: string): number => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  // Handle return overdue book
  const handleReturnBook = async (issue: any) => {
    try {
      const result = await returnBook({
        bookIssueId: issue.id,
        returnDate: new Date().toISOString(),
        condition: "GOOD",
        notes: "Returned overdue",
      }).unwrap();

      if (result.data?.fine) {
        toast.warning(`Book returned with fine: $${result.data.fine.amount}`);
      } else {
        toast.success("Book returned successfully");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to return book");
    }
  };

  // Handle pay fine
  const handlePayFine = async () => {
    try {
      if (!payFineFormData.issueId || payFineFormData.amount <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }

      await payFine({
        bookIssueId: payFineFormData.issueId,
        amount: payFineFormData.amount,
        paymentMethod: payFineFormData.paymentMethod,
      }).unwrap();

      toast.success("Fine paid successfully");
      setIsPayFineDialogOpen(false);
      setPayFineFormData({
        issueId: "",
        amount: 0,
        paymentMethod: "CASH",
        notes: "",
      });
      setSelectedOverdueIssue(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to process payment");
    }
  };

  // Handle renew overdue book
  const handleRenewBook = async (issueId: string) => {
    try {
      await renewBook({ issueId }).unwrap();
      toast.success("Book renewed successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to renew book");
    }
  };

  // Open pay fine dialog
  const openPayFineDialog = (issue: any) => {
    setSelectedOverdueIssue(issue);
    setPayFineFormData({
      issueId: issue.id,
      amount: issue.fineAmount || 0,
      paymentMethod: "CASH",
      notes: "",
    });
    setIsPayFineDialogOpen(true);
  };

  // Get severity color based on days overdue
  const getSeverityColor = (daysOverdue: number) => {
    if (daysOverdue >= 30) return "bg-red-100 text-red-800 border-red-200";
    if (daysOverdue >= 14) return "bg-orange-100 text-orange-800 border-orange-200";
    if (daysOverdue >= 7) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-blue-100 text-blue-800 border-blue-200";
  };

  // Get user type color
  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case "STUDENT":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "TEACHER":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Filter overdue books
  const filteredOverdueBooks = overdueBooks.filter((issue) => {
    const matchesSearch = 
      issue.book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.member?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.book?.author?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUserType = userTypeFilter === "all" || issue.userType === userTypeFilter;
    
    let matchesFineRange = true;
    if (fineRangeFilter !== "all") {
      const fine = issue.fineAmount || 0;
      switch (fineRangeFilter) {
        case "low":
          matchesFineRange = fine < 10;
          break;
        case "medium":
          matchesFineRange = fine >= 10 && fine < 50;
          break;
        case "high":
          matchesFineRange = fine >= 50;
          break;
      }
    }
    
    return matchesSearch && matchesUserType && matchesFineRange;
  });

  // Calculate statistics
  const totalOverdue = overdueBooks.length;
  const totalFines = overdueBooks.reduce((sum, issue) => sum + (issue.fineAmount || 0), 0);
  const unpaidFines = overdueBooks.filter(issue => !issue.finePaid).reduce((sum, issue) => sum + (issue.fineAmount || 0), 0);
  const criticalOverdue = overdueBooks.filter(issue => calculateDaysOverdue(issue.dueDate) >= 30).length;

  // Group by severity
  const criticalBooks = filteredOverdueBooks.filter(issue => calculateDaysOverdue(issue.dueDate) >= 30);
  const severeBooks = filteredOverdueBooks.filter(issue => {
    const days = calculateDaysOverdue(issue.dueDate);
    return days >= 14 && days < 30;
  });
  const moderateBooks = filteredOverdueBooks.filter(issue => {
    const days = calculateDaysOverdue(issue.dueDate);
    return days >= 7 && days < 14;
  });
  const recentBooks = filteredOverdueBooks.filter(issue => calculateDaysOverdue(issue.dueDate) < 7);

  if (!isAdmin() && !isLibrarian()) {
    return (
      <SidebarInset>
        <div className="flex-1 space-y-6 p-6">
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Access Restricted</h3>
            <p className="text-muted-foreground">
              You don't have permission to access this page.
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
            <h2 className="text-3xl font-bold tracking-tight">Overdue Books</h2>
            <p className="text-muted-foreground">
              Manage overdue books and collect fines
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Send Reminders
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Overdue</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOverdue}</div>
              <p className="text-xs text-muted-foreground">Books overdue</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical (30+ days)</CardTitle>
              <Clock className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{criticalOverdue}</div>
              <p className="text-xs text-muted-foreground">Need immediate attention</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fines</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalFines.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">All overdue fines</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unpaid Fines</CardTitle>
              <CreditCard className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">${unpaidFines.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Outstanding payments</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Overdue Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by book title, author, or member name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <User className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="User Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="STUDENT">Students</SelectItem>
                  <SelectItem value="TEACHER">Teachers</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={fineRangeFilter} onValueChange={setFineRangeFilter}>
                <SelectTrigger className="w-[180px]">
                  <DollarSign className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Fine Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fines</SelectItem>
                  <SelectItem value="low">Under $10</SelectItem>
                  <SelectItem value="medium">$10 - $50</SelectItem>
                  <SelectItem value="high">Over $50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Overdue Books Table with Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Overdue Books by Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">
                  All ({filteredOverdueBooks.length})
                </TabsTrigger>
                <TabsTrigger value="critical" className="text-red-600">
                  Critical ({criticalBooks.length})
                </TabsTrigger>
                <TabsTrigger value="severe" className="text-orange-600">
                  Severe ({severeBooks.length})
                </TabsTrigger>
                <TabsTrigger value="moderate" className="text-yellow-600">
                  Moderate ({moderateBooks.length})
                </TabsTrigger>
                <TabsTrigger value="recent" className="text-blue-600">
                  Recent ({recentBooks.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-4">
                <OverdueTable 
                  books={filteredOverdueBooks}
                  isLoading={isLoading}
                  error={error}
                  onReturn={handleReturnBook}
                  onPayFine={openPayFineDialog}
                  onRenew={handleRenewBook}
                  isReturning={isReturning}
                  isRenewing={isRenewing}
                  calculateDaysOverdue={calculateDaysOverdue}
                  getSeverityColor={getSeverityColor}
                  getUserTypeColor={getUserTypeColor}
                />
              </TabsContent>
              
              <TabsContent value="critical" className="mt-4">
                <OverdueTable 
                  books={criticalBooks}
                  isLoading={isLoading}
                  error={error}
                  onReturn={handleReturnBook}
                  onPayFine={openPayFineDialog}
                  onRenew={handleRenewBook}
                  isReturning={isReturning}
                  isRenewing={isRenewing}
                  calculateDaysOverdue={calculateDaysOverdue}
                  getSeverityColor={getSeverityColor}
                  getUserTypeColor={getUserTypeColor}
                />
              </TabsContent>
              
              <TabsContent value="severe" className="mt-4">
                <OverdueTable 
                  books={severeBooks}
                  isLoading={isLoading}
                  error={error}
                  onReturn={handleReturnBook}
                  onPayFine={openPayFineDialog}
                  onRenew={handleRenewBook}
                  isReturning={isReturning}
                  isRenewing={isRenewing}
                  calculateDaysOverdue={calculateDaysOverdue}
                  getSeverityColor={getSeverityColor}
                  getUserTypeColor={getUserTypeColor}
                />
              </TabsContent>
              
              <TabsContent value="moderate" className="mt-4">
                <OverdueTable 
                  books={moderateBooks}
                  isLoading={isLoading}
                  error={error}
                  onReturn={handleReturnBook}
                  onPayFine={openPayFineDialog}
                  onRenew={handleRenewBook}
                  isReturning={isReturning}
                  isRenewing={isRenewing}
                  calculateDaysOverdue={calculateDaysOverdue}
                  getSeverityColor={getSeverityColor}
                  getUserTypeColor={getUserTypeColor}
                />
              </TabsContent>
              
              <TabsContent value="recent" className="mt-4">
                <OverdueTable 
                  books={recentBooks}
                  isLoading={isLoading}
                  error={error}
                  onReturn={handleReturnBook}
                  onPayFine={openPayFineDialog}
                  onRenew={handleRenewBook}
                  isReturning={isReturning}
                  isRenewing={isRenewing}
                  calculateDaysOverdue={calculateDaysOverdue}
                  getSeverityColor={getSeverityColor}
                  getUserTypeColor={getUserTypeColor}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Pay Fine Dialog */}
        <Dialog open={isPayFineDialogOpen} onOpenChange={setIsPayFineDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Pay Fine</DialogTitle>
              <DialogDescription>
                Process fine payment for "{selectedOverdueIssue?.book?.title}"
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Fine Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={payFineFormData.amount}
                  onChange={(e) =>
                    setPayFineFormData({ ...payFineFormData, amount: parseFloat(e.target.value) || 0 })
                  }
                  placeholder="Enter amount"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="payment-method">Payment Method</Label>
                <Select
                  value={payFineFormData.paymentMethod}
                  onValueChange={(value) =>
                    setPayFineFormData({ ...payFineFormData, paymentMethod: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Cash</SelectItem>
                    <SelectItem value="CARD">Credit/Debit Card</SelectItem>
                    <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                    <SelectItem value="CHEQUE">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="payment-notes">Notes (Optional)</Label>
                <Textarea
                  id="payment-notes"
                  value={payFineFormData.notes}
                  onChange={(e) =>
                    setPayFineFormData({ ...payFineFormData, notes: e.target.value })
                  }
                  placeholder="Add any payment notes"
                  rows={3}
                />
              </div>

              {selectedOverdueIssue && (
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Issue Details</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Member:</strong> {selectedOverdueIssue.member?.name}</p>
                    <p><strong>Due Date:</strong> {new Date(selectedOverdueIssue.dueDate).toLocaleDateString()}</p>
                    <p><strong>Days Overdue:</strong> {calculateDaysOverdue(selectedOverdueIssue.dueDate)} days</p>
                    <p className="text-red-600">
                      <strong>Total Fine:</strong> ${(selectedOverdueIssue.fineAmount || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsPayFineDialogOpen(false);
                  setSelectedOverdueIssue(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePayFine}
                disabled={isPayingFine || payFineFormData.amount <= 0}
              >
                {isPayingFine ? "Processing..." : "Process Payment"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarInset>
  );
}

// Overdue Table Component
interface OverdueTableProps {
  books: any[];
  isLoading: boolean;
  error: any;
  onReturn: (issue: any) => void;
  onPayFine: (issue: any) => void;
  onRenew: (issueId: string) => void;
  isReturning: boolean;
  isRenewing: boolean;
  calculateDaysOverdue: (dueDate: string) => number;
  getSeverityColor: (daysOverdue: number) => string;
  getUserTypeColor: (userType: string) => string;
}

function OverdueTable({ 
  books, 
  isLoading, 
  error, 
  onReturn, 
  onPayFine, 
  onRenew,
  isReturning,
  isRenewing,
  calculateDaysOverdue,
  getSeverityColor,
  getUserTypeColor 
}: OverdueTableProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading overdue books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
        <p>Error loading overdue books</p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
        <p>No overdue books found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Book</TableHead>
          <TableHead>Member</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Days Overdue</TableHead>
          <TableHead>Fine</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {books.map((issue) => {
          const daysOverdue = calculateDaysOverdue(issue.dueDate);
          return (
            <TableRow key={issue.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{issue.book?.title}</div>
                  <div className="text-sm text-muted-foreground">
                    by {issue.book?.author}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{issue.member?.name}</div>
                  <Badge className={getUserTypeColor(issue.userType)}>
                    {issue.userType}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {new Date(issue.dueDate).toLocaleDateString()}
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getSeverityColor(daysOverdue)}>
                  {daysOverdue} days
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-red-600 font-medium">
                    ${(issue.fineAmount || 0).toFixed(2)}
                  </span>
                  {issue.finePaid ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge className="bg-red-100 text-red-800 border-red-200">
                  OVERDUE
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onReturn(issue)}
                    disabled={isReturning}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Return
                  </Button>
                  {!issue.finePaid && issue.fineAmount > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPayFine(issue)}
                    >
                      <CreditCard className="h-4 w-4 mr-1" />
                      Pay Fine
                    </Button>
                  )}
                  {issue.renewalCount < issue.maxRenewals && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRenew(issue.id)}
                      disabled={isRenewing}
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Renew
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
} 