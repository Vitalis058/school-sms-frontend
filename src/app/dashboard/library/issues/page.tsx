"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  DollarSign,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
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
  useGetBookIssuesQuery,
  useIssueBookMutation,
  useReturnBookMutation,
  useRenewBookMutation,
  useGetBooksQuery,
  useGetLibraryMembersQuery,
} from "@/store/api/libraryApi";
import { usePermissions } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface IssueFormData {
  bookId: string;
  userId: string;
  userType: "STUDENT" | "TEACHER";
  notes: string;
}

interface ReturnFormData {
  issueId: string;
  condition: "GOOD" | "DAMAGED" | "LOST";
  notes: string;
}

export default function IssuesPage() {
  const { isAdmin, isLibrarian } = usePermissions();
  const [activeTab, setActiveTab] = useState("all-issues");
  const [isIssueDialogOpen, setIsIssueDialogOpen] = useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [userTypeFilter, setUserTypeFilter] = useState<string>("all");

  // API hooks
  const { data: issuesResponse, isLoading: issuesLoading, error: issuesError } = useGetBookIssuesQuery({});
  const { data: booksResponse } = useGetBooksQuery({});
  const { data: membersResponse } = useGetLibraryMembersQuery({});
  const [issueBook, { isLoading: isIssuing }] = useIssueBookMutation();
  const [returnBook, { isLoading: isReturning }] = useReturnBookMutation();
  const [renewBook, { isLoading: isRenewing }] = useRenewBookMutation();

  // Extract data from responses
  const issues = issuesResponse?.data || [];
  const books = booksResponse?.data || [];
  const members = membersResponse?.data || [];

  // Form states
  const [issueFormData, setIssueFormData] = useState<IssueFormData>({
    bookId: "",
    userId: "",
    userType: "STUDENT",
    notes: "",
  });

  const [returnFormData, setReturnFormData] = useState<ReturnFormData>({
    issueId: "",
    condition: "GOOD",
    notes: "",
  });

  const [selectedIssue, setSelectedIssue] = useState<any>(null);

  // Handle issue book
  const handleIssueBook = async () => {
    try {
      if (!issueFormData.bookId || !issueFormData.userId) {
        toast.error("Please select both book and member");
        return;
      }

      // Calculate due date based on user type (default loan periods)
      const loanDays = issueFormData.userType === "STUDENT" ? 14 : 30; // 14 days for students, 30 for teachers
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + loanDays);

      await issueBook({
        bookId: issueFormData.bookId,
        userId: issueFormData.userId,
        userType: issueFormData.userType,
        dueDate: dueDate.toISOString(),
        notes: issueFormData.notes,
      }).unwrap();

      toast.success("Book issued successfully");
      setIsIssueDialogOpen(false);
      setIssueFormData({
        bookId: "",
        userId: "",
        userType: "STUDENT",
        notes: "",
      });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to issue book");
    }
  };

  // Handle return book
  const handleReturnBook = async () => {
    try {
      if (!returnFormData.issueId) {
        toast.error("Please select an issue to return");
        return;
      }

      const result = await returnBook({
        bookIssueId: returnFormData.issueId,
        returnDate: new Date().toISOString(),
        condition: returnFormData.condition,
        notes: returnFormData.notes,
      }).unwrap();

      if (result.data?.fineAmount && result.data.fineAmount > 0) {
        toast.warning(`Book returned with fine: $${result.data.fineAmount.toFixed(2)}`);
      } else {
        toast.success("Book returned successfully");
      }

      setIsReturnDialogOpen(false);
      setReturnFormData({
        issueId: "",
        condition: "GOOD",
        notes: "",
      });
      setSelectedIssue(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to return book");
    }
  };

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

  // Filter issues
  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = 
      issue.Book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.User?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.User?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.Book?.author?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter;
    const matchesUserType = userTypeFilter === "all" || issue.userType === userTypeFilter;
    
    return matchesSearch && matchesStatus && matchesUserType;
  });

  // Get issues by status for tabs
  const issuedBooks = filteredIssues.filter(issue => issue.status === "ISSUED");
  const overdueBooks = filteredIssues.filter(issue => issue.status === "OVERDUE");
  const returnedBooks = filteredIssues.filter(issue => issue.status === "RETURNED");

  // Calculate statistics
  const totalIssued = issues.filter(issue => issue.status === "ISSUED").length;
  const totalOverdue = issues.filter(issue => issue.status === "OVERDUE").length;
  const totalReturned = issues.filter(issue => issue.status === "RETURNED").length;
  const totalFines = issues.reduce((sum, issue) => sum + (issue.fineAmount || 0), 0);

  // Open return dialog with selected issue
  const openReturnDialog = (issue: any) => {
    setSelectedIssue(issue);
    setReturnFormData({
      issueId: issue.id,
      condition: "GOOD",
      notes: "",
    });
    setIsReturnDialogOpen(true);
  };

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
            <h2 className="text-3xl font-bold tracking-tight">Issue & Return Books</h2>
            <p className="text-muted-foreground">
              Manage book issues, returns, and renewals
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isIssueDialogOpen} onOpenChange={setIsIssueDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Issue Book
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Issue New Book</DialogTitle>
                  <DialogDescription>
                    Issue a book to a library member
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="book">Book</Label>
                    <Select
                      value={issueFormData.bookId}
                      onValueChange={(value) =>
                        setIssueFormData({ ...issueFormData, bookId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a book" />
                      </SelectTrigger>
                      <SelectContent>
                        {books
                          .filter(book => book.availableCopies > 0)
                          .map((book) => (
                            <SelectItem key={book.id} value={book.id}>
                              {book.title} - {book.author} ({book.availableCopies} available)
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="member">Member</Label>
                    <Select
                      value={issueFormData.userId}
                      onValueChange={(value) => {
                        const member = members.find(m => m.userId === value);
                        setIssueFormData({ 
                          ...issueFormData, 
                          userId: value,
                          userType: member?.userType || "STUDENT"
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a member" />
                      </SelectTrigger>
                      <SelectContent>
                        {members
                          .filter(member => member.status === "ACTIVE")
                          .map((member) => (
                            <SelectItem key={member.userId} value={member.userId}>
                              {member.User ? `${member.User.firstName} ${member.User.lastName}` : `User ${member.userId}`} ({member.userType}) - {member.currentBooksIssued}/{member.maxBooksAllowed} books
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={issueFormData.notes}
                      onChange={(e) =>
                        setIssueFormData({ ...issueFormData, notes: e.target.value })
                      }
                      placeholder="Add any notes about this issue"
                      rows={3}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsIssueDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleIssueBook}
                    disabled={isIssuing || !issueFormData.bookId || !issueFormData.userId}
                  >
                    {isIssuing ? "Issuing..." : "Issue Book"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Currently Issued</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalIssued}</div>
              <p className="text-xs text-muted-foreground">Active issues</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOverdue}</div>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Returned Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {returnedBooks.filter(issue => {
                  const returnDate = new Date(issue.returnDate || "");
                  const today = new Date();
                  return returnDate.toDateString() === today.toDateString();
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">Books returned</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fines</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalFines.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Outstanding fines</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Issues</CardTitle>
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
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ISSUED">Issued</SelectItem>
                  <SelectItem value="OVERDUE">Overdue</SelectItem>
                  <SelectItem value="RETURNED">Returned</SelectItem>
                  <SelectItem value="LOST">Lost</SelectItem>
                  <SelectItem value="DAMAGED">Damaged</SelectItem>
                </SelectContent>
              </Select>
              
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
            </div>
          </CardContent>
        </Card>

        {/* Issues Table with Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Book Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all-issues">
                  All Issues ({filteredIssues.length})
                </TabsTrigger>
                <TabsTrigger value="issued">
                  Issued ({issuedBooks.length})
                </TabsTrigger>
                <TabsTrigger value="overdue">
                  Overdue ({overdueBooks.length})
                </TabsTrigger>
                <TabsTrigger value="returned">
                  Returned ({returnedBooks.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all-issues" className="mt-4">
                <IssuesTable 
                  issues={filteredIssues}
                  isLoading={issuesLoading}
                  error={issuesError}
                  onReturn={openReturnDialog}
                  onRenew={handleRenewBook}
                  isRenewing={isRenewing}
                  getStatusColor={getStatusColor}
                  getUserTypeColor={getUserTypeColor}
                />
              </TabsContent>
              
              <TabsContent value="issued" className="mt-4">
                <IssuesTable 
                  issues={issuedBooks}
                  isLoading={issuesLoading}
                  error={issuesError}
                  onReturn={openReturnDialog}
                  onRenew={handleRenewBook}
                  isRenewing={isRenewing}
                  getStatusColor={getStatusColor}
                  getUserTypeColor={getUserTypeColor}
                />
              </TabsContent>
              
              <TabsContent value="overdue" className="mt-4">
                <IssuesTable 
                  issues={overdueBooks}
                  isLoading={issuesLoading}
                  error={issuesError}
                  onReturn={openReturnDialog}
                  onRenew={handleRenewBook}
                  isRenewing={isRenewing}
                  getStatusColor={getStatusColor}
                  getUserTypeColor={getUserTypeColor}
                />
              </TabsContent>
              
              <TabsContent value="returned" className="mt-4">
                <IssuesTable 
                  issues={returnedBooks}
                  isLoading={issuesLoading}
                  error={issuesError}
                  onReturn={openReturnDialog}
                  onRenew={handleRenewBook}
                  isRenewing={isRenewing}
                  getStatusColor={getStatusColor}
                  getUserTypeColor={getUserTypeColor}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Return Book Dialog */}
        <Dialog open={isReturnDialogOpen} onOpenChange={setIsReturnDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Return Book</DialogTitle>
              <DialogDescription>
                Process the return of "{selectedIssue?.book?.title}"
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="condition">Book Condition</Label>
                <Select
                  value={returnFormData.condition}
                  onValueChange={(value: "GOOD" | "DAMAGED" | "LOST") =>
                    setReturnFormData({ ...returnFormData, condition: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GOOD">Good Condition</SelectItem>
                    <SelectItem value="DAMAGED">Damaged</SelectItem>
                    <SelectItem value="LOST">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="return-notes">Return Notes (Optional)</Label>
                <Textarea
                  id="return-notes"
                  value={returnFormData.notes}
                  onChange={(e) =>
                    setReturnFormData({ ...returnFormData, notes: e.target.value })
                  }
                  placeholder="Add any notes about the return"
                  rows={3}
                />
              </div>

              {selectedIssue && (
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Issue Details</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Member:</strong> {selectedIssue.User ? `${selectedIssue.User.firstName} ${selectedIssue.User.lastName}` : `User ${selectedIssue.userId}`}</p>
                    <p><strong>Issue Date:</strong> {new Date(selectedIssue.issueDate).toLocaleDateString()}</p>
                    <p><strong>Due Date:</strong> {new Date(selectedIssue.dueDate).toLocaleDateString()}</p>
                    {selectedIssue.fineAmount > 0 && (
                      <p className="text-red-600">
                        <strong>Fine:</strong> ${selectedIssue.fineAmount.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsReturnDialogOpen(false);
                  setSelectedIssue(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleReturnBook}
                disabled={isReturning}
              >
                {isReturning ? "Processing..." : "Return Book"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarInset>
  );
}

// Issues Table Component
interface IssuesTableProps {
  issues: any[];
  isLoading: boolean;
  error: any;
  onReturn: (issue: any) => void;
  onRenew: (issueId: string) => void;
  isRenewing: boolean;
  getStatusColor: (status: string) => string;
  getUserTypeColor: (userType: string) => string;
}

function IssuesTable({ 
  issues, 
  isLoading, 
  error, 
  onReturn, 
  onRenew, 
  isRenewing,
  getStatusColor,
  getUserTypeColor 
}: IssuesTableProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading issues...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
        <p>Error loading issues</p>
      </div>
    );
  }

  if (issues.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <BookOpen className="h-8 w-8 mx-auto mb-2" />
        <p>No issues found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Book</TableHead>
          <TableHead>Member</TableHead>
          <TableHead>Issue Date</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Fine</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {issues.map((issue) => (
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
              <div>
                <div className="font-medium">
                  {issue.User ? `${issue.User.firstName} ${issue.User.lastName}` : `User ${issue.userId}`}
                </div>
                <Badge className={getUserTypeColor(issue.userType)}>
                  {issue.userType}
                </Badge>
              </div>
            </TableCell>
            <TableCell>
              {new Date(issue.issueDate).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {new Date(issue.dueDate).toLocaleDateString()}
                {new Date(issue.dueDate) < new Date() && issue.status !== "RETURNED" && (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
              </div>
            </TableCell>
            <TableCell>
              <Badge className={getStatusColor(issue.status)}>
                {issue.status}
              </Badge>
            </TableCell>
            <TableCell>
              {issue.fineAmount > 0 ? (
                <span className="text-red-600 font-medium">
                  ${issue.fineAmount.toFixed(2)}
                </span>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {issue.status === "ISSUED" || issue.status === "OVERDUE" ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onReturn(issue)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Return
                    </Button>
                    {issue.renewalCount < issue.maxRenewals && (
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
                  </>
                ) : (
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 