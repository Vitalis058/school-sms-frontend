"use client";

import React, { useState } from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { usePermissions } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon,
  Download,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Receipt,
  Send,
  Eye,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import LoadingComponent from "@/components/LoadingComponent";
import ErrorComponent from "@/components/ErrorComponent";
import {
  useGetFeeAnalyticsQuery,
  useGetFeeRecordsQuery,
  useGetFeePaymentsQuery,
  useGetStudentFeeRecordsQuery,
  useCreateFeePaymentMutation,
  useGenerateReceiptMutation,
  useSendFeeReminderMutation,
} from "@/store/api/financeApi";
import { useGetGradesQuery, useGetStreamsByGradeQuery } from "@/store/api/academicsApi";
import { useGetStudentsQuery } from "@/store/api/studentApi";
import { FeePaymentForm } from "@/components/FeePaymentForm";
import { FeeStructureForm } from "@/components/FeeStructureForm";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

// Mock data for demonstration
const mockAnalytics = {
  totalFeesCollected: 2450000,
  totalOutstanding: 350000,
  collectionRate: 87.5,
  totalStudents: 450,
  paidStudents: 394,
  pendingStudents: 56,
  overdueStudents: 12,
  monthlyCollection: [
    { month: "Jan", amount: 420000, count: 89 },
    { month: "Feb", amount: 380000, count: 85 },
    { month: "Mar", amount: 450000, count: 95 },
    { month: "Apr", amount: 410000, count: 88 },
    { month: "May", amount: 390000, count: 82 },
    { month: "Jun", amount: 400000, count: 87 },
  ],
  categoryWiseCollection: [
    { category: "TUITION", amount: 1800000, percentage: 73.5 },
    { category: "EXAMINATION", amount: 250000, percentage: 10.2 },
    { category: "LIBRARY", amount: 150000, percentage: 6.1 },
    { category: "LABORATORY", amount: 120000, percentage: 4.9 },
    { category: "TRANSPORT", amount: 130000, percentage: 5.3 },
  ],
  gradeWiseCollection: [
    { gradeId: "1", gradeName: "Grade 1", totalAmount: 300000, collectedAmount: 270000, collectionRate: 90 },
    { gradeId: "2", gradeName: "Grade 2", totalAmount: 320000, collectedAmount: 288000, collectionRate: 90 },
    { gradeId: "3", gradeName: "Grade 3", totalAmount: 340000, collectedAmount: 289000, collectionRate: 85 },
    { gradeId: "4", gradeName: "Grade 4", totalAmount: 360000, collectedAmount: 306000, collectionRate: 85 },
    { gradeId: "5", gradeName: "Grade 5", totalAmount: 380000, collectedAmount: 323000, collectionRate: 85 },
  ],
};

const StatusBadge = ({ status }: { status: string }) => {
  const getVariant = () => {
    switch (status) {
      case "PAID": return "default";
      case "PARTIAL": return "secondary";
      case "PENDING": return "outline";
      case "OVERDUE": return "destructive";
      default: return "outline";
    }
  };

  return <Badge variant={getVariant()}>{status}</Badge>;
};

export default function FeesPage() {
  const { canRead, canCreate, canUpdate, isAdmin, isStaff, isAuthenticated } = usePermissions();
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [selectedStream, setSelectedStream] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<string>("all");
  const [academicYear, setAcademicYear] = useState<string>(new Date().getFullYear().toString());
  const [searchTerm, setSearchTerm] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isFeeStructureModalOpen, setIsFeeStructureModalOpen] = useState(false);
  const [selectedFeeRecord, setSelectedFeeRecord] = useState<any>(null);

  // Only make API calls if authenticated to prevent 401 errors
  const shouldMakeApiCalls = isAuthenticated && (canRead("students") || isAdmin() || isStaff());

  // API queries with error handling - skip if not authenticated
  const { data: grades = [], isLoading: gradesLoading, error: gradesError } = useGetGradesQuery(undefined, {
    skip: !shouldMakeApiCalls,
  });
  const { data: streams = [], isLoading: streamsLoading, error: streamsError } = useGetStreamsByGradeQuery(selectedGrade, {
    skip: !shouldMakeApiCalls || !selectedGrade || selectedGrade === "all",
  });
  const { data: studentsResponse, isLoading: studentsLoading, error: studentsError } = useGetStudentsQuery({
    gradeId: selectedGrade !== "all" ? selectedGrade : undefined,
    streamId: selectedStream !== "all" ? selectedStream : undefined,
  }, {
    skip: !shouldMakeApiCalls,
  });

  // Fee data queries with error handling - skip if not authenticated
  const { data: feeAnalytics, isLoading: analyticsLoading, error: analyticsError } = useGetFeeAnalyticsQuery({
    academicYear,
    gradeId: selectedGrade !== "all" ? selectedGrade : undefined,
    streamId: selectedStream !== "all" ? selectedStream : undefined,
  }, {
    skip: !shouldMakeApiCalls,
  });

  const { data: feeRecordsResponse, isLoading: feeRecordsLoading, error: feeRecordsError } = useGetFeeRecordsQuery({
    gradeId: selectedGrade !== "all" ? selectedGrade : undefined,
    streamId: selectedStream !== "all" ? selectedStream : undefined,
    studentId: selectedStudent !== "all" ? selectedStudent : undefined,
    academicYear,
    search: searchTerm,
  }, {
    skip: !shouldMakeApiCalls,
  });

  const { data: paymentsResponse, isLoading: paymentsLoading, error: paymentsError } = useGetFeePaymentsQuery({
    studentId: selectedStudent !== "all" ? selectedStudent : undefined,
  }, {
    skip: !shouldMakeApiCalls,
  });

  // Mutations
  const [createPayment, { isLoading: isCreatingPayment }] = useCreateFeePaymentMutation();
  const [generateReceipt] = useGenerateReceiptMutation();
  const [sendReminder] = useSendFeeReminderMutation();

  // Use mock data when API calls fail or are skipped
  const students = studentsResponse?.data || [];
  const feeRecords = feeRecordsResponse?.data || [];
  const payments = paymentsResponse?.data || [];

  // Ensure all arrays are properly defined to prevent map errors
  const safeStudents = Array.isArray(students) ? students : [];
  const safeFeeRecords = Array.isArray(feeRecords) ? feeRecords : [];
  const safePayments = Array.isArray(payments) ? payments : [];
  const safeGrades = Array.isArray(grades) ? grades : [];
  const safeStreams = Array.isArray(streams) ? streams : [];

  // Check for authentication errors (but only if we tried to make API calls)
  const hasAuthError = shouldMakeApiCalls && (gradesError || streamsError || studentsError || analyticsError || feeRecordsError || paymentsError);
  
  // If there are authentication errors, show a message but still allow viewing with mock data
  if (hasAuthError) {
    console.warn("API error detected, using mock data:", { gradesError, streamsError, studentsError, analyticsError, feeRecordsError, paymentsError });
  }

  // Ensure analytics has required arrays to prevent map errors
  const safeAnalytics = {
    totalFeesCollected: feeAnalytics?.data?.totalFeesCollected || mockAnalytics.totalFeesCollected,
    totalOutstanding: feeAnalytics?.data?.totalOutstanding || mockAnalytics.totalOutstanding,
    collectionRate: feeAnalytics?.data?.collectionRate || mockAnalytics.collectionRate,
    totalStudents: feeAnalytics?.data?.totalStudents || mockAnalytics.totalStudents,
    paidStudents: feeAnalytics?.data?.paidStudents || mockAnalytics.paidStudents,
    pendingStudents: feeAnalytics?.data?.pendingStudents || mockAnalytics.pendingStudents,
    overdueStudents: feeAnalytics?.data?.overdueStudents || mockAnalytics.overdueStudents,
    monthlyCollection: feeAnalytics?.data?.monthlyCollection || mockAnalytics.monthlyCollection,
    categoryWiseCollection: feeAnalytics?.data?.categoryWiseCollection || mockAnalytics.categoryWiseCollection,
    gradeWiseCollection: feeAnalytics?.data?.gradeWiseCollection || mockAnalytics.gradeWiseCollection,
  };

  const handlePayment = async (paymentData: any) => {
    try {
      await createPayment(paymentData).unwrap();
      toast.success("Payment recorded successfully");
      setIsPaymentModalOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleGenerateReceipt = async (paymentId: string) => {
    try {
      const result = await generateReceipt(paymentId).unwrap();
      window.open(result.data.receiptUrl, '_blank');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleSendReminder = async (studentId: string, feeRecordId: string) => {
    try {
      await sendReminder({ studentId, feeRecordId, reminderType: "EMAIL" }).unwrap();
      toast.success("Reminder sent successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  // Check permissions
  if (!isAuthenticated) {
    return (
      <SidebarInset>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground">
              Please log in to access fee management.
            </p>
          </div>
        </div>
      </SidebarInset>
    );
  }

  if (!canRead("students") && !isAdmin() && !isStaff()) {
    return (
      <SidebarInset>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to view fee management data.
            </p>
          </div>
        </div>
      </SidebarInset>
    );
  }

  const isLoading = shouldMakeApiCalls && (gradesLoading || streamsLoading || studentsLoading || analyticsLoading);

  if (isLoading) return <LoadingComponent message="Loading fee data..." />;
  
  if (analyticsError) return <ErrorComponent message="Failed to load fee data. Please try again." />;

  // Use real data or fallback to mock data
  const analytics = feeAnalytics?.data || mockAnalytics;

  return (
    <SidebarInset>
      <div className="p-6 space-y-6">
        {/* Authentication Error Notice */}
        {hasAuthError && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  Authentication Required
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Please log in to view real data. Currently showing demo data.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fee Management</h1>
            <p className="text-muted-foreground">
              Manage student fees, payments, and financial records.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            {canCreate("students") && (
              <>
                <Dialog open={isFeeStructureModalOpen} onOpenChange={setIsFeeStructureModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Fee Structure
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add Fee Structure</DialogTitle>
                    </DialogHeader>
                    <FeeStructureForm 
                      onSuccess={() => setIsFeeStructureModalOpen(false)}
                      onCancel={() => setIsFeeStructureModalOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
                <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Record Payment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Record Fee Payment</DialogTitle>
                    </DialogHeader>
                    <FeePaymentForm 
                      onSuccess={handlePayment}
                      onCancel={() => setIsPaymentModalOpen(false)}
                      selectedFeeRecord={selectedFeeRecord}
                    />
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Academic Year</label>
                <Select value={academicYear} onValueChange={setAcademicYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Grade</label>
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Grades</SelectItem>
                    {safeGrades.map((grade) => (
                      <SelectItem key={grade.id} value={grade.id}>
                        {grade.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Stream</label>
                <Select value={selectedStream} onValueChange={setSelectedStream} disabled={!selectedGrade || selectedGrade === "all"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stream" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Streams</SelectItem>
                    {safeStreams.map((stream) => (
                      <SelectItem key={stream.id} value={stream.id}>
                        {stream.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Student</label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    {safeStudents.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.firstName} {student.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${safeAnalytics.totalFeesCollected.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Collection rate: {safeAnalytics.collectionRate}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                ${safeAnalytics.totalOutstanding.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {safeAnalytics.pendingStudents} students pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students Paid</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {safeAnalytics.paidStudents}
              </div>
              <p className="text-xs text-muted-foreground">
                Out of {safeAnalytics.totalStudents} students
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {safeAnalytics.overdueStudents}
              </div>
              <p className="text-xs text-muted-foreground">
                Students with overdue fees
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="fee-records">Fee Records</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Collection Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Collection Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border rounded-lg">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-2">Monthly Collection Trend</h3>
                      <div className="grid grid-cols-6 gap-2 text-sm">
                        {safeAnalytics.monthlyCollection.map((month, index) => (
                          <div key={index} className="text-center">
                            <div className="font-medium">{month.month}</div>
                            <div className="text-muted-foreground">${month.amount.toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Category-wise Collection */}
              <Card>
                <CardHeader>
                  <CardTitle>Fee Category Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border rounded-lg">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-4">Fee Category Distribution</h3>
                      <div className="space-y-2">
                        {safeAnalytics.categoryWiseCollection.map((category, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="font-medium">{category.category}</span>
                            <span className="text-muted-foreground">
                              ${category.amount.toLocaleString()} ({category.percentage}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Grade-wise Collection */}
            <Card>
              <CardHeader>
                <CardTitle>Grade-wise Collection Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center border rounded-lg">
                  <div className="text-center w-full">
                    <h3 className="text-lg font-semibold mb-4">Grade-wise Collection</h3>
                    <div className="space-y-3">
                      {safeAnalytics.gradeWiseCollection.map((grade, index) => (
                        <div key={index} className="flex justify-between items-center p-2 border rounded">
                          <span className="font-medium">{grade.gradeName}</span>
                          <div className="text-right">
                            <div className="text-sm">
                              Collected: ${grade.collectedAmount.toLocaleString()} / ${grade.totalAmount.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Rate: {grade.collectionRate}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fee-records" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Fee Records</CardTitle>
              </CardHeader>
              <CardContent>
                {feeRecordsLoading ? (
                  <div className="text-center py-4">Loading fee records...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Fee Type</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Paid Amount</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {safeFeeRecords.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-4">
                            No fee records found
                          </TableCell>
                        </TableRow>
                      ) : (
                        safeFeeRecords.map((record: any) => (
                          <TableRow key={record.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {record.Student?.firstName} {record.Student?.lastName}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {record.Student?.admissionNumber}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{record.FeeStructure?.name}</TableCell>
                            <TableCell>${record.totalAmount?.toLocaleString()}</TableCell>
                            <TableCell>${record.paidAmount?.toLocaleString()}</TableCell>
                            <TableCell>${record.balanceAmount?.toLocaleString()}</TableCell>
                            <TableCell>
                              <StatusBadge status={record.status} />
                            </TableCell>
                            <TableCell>
                              {record.dueDate ? new Date(record.dueDate).toLocaleDateString() : 'N/A'}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {canCreate("students") && record.balanceAmount > 0 && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedFeeRecord(record);
                                      setIsPaymentModalOpen(true);
                                    }}
                                  >
                                    <CreditCard className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSendReminder(record.studentId, record.id)}
                                >
                                  <Send className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
              </CardHeader>
              <CardContent>
                {paymentsLoading ? (
                  <div className="text-center py-4">Loading payments...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Receipt No.</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {safePayments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4">
                            No payments found
                          </TableCell>
                        </TableRow>
                      ) : (
                        safePayments.map((payment: any) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">
                              {payment.receiptNumber}
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {payment.Student?.firstName} {payment.Student?.lastName}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {payment.Student?.admissionNumber}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>${payment.amount?.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{payment.paymentMethod}</Badge>
                            </TableCell>
                            <TableCell>
                              {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={payment.status} />
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleGenerateReceipt(payment.id)}
                              >
                                <Receipt className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Collection vs Outstanding</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Fees</span>
                      <span className="font-bold">
                        ${(safeAnalytics.totalFeesCollected + safeAnalytics.totalOutstanding).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(safeAnalytics.totalFeesCollected / (safeAnalytics.totalFeesCollected + safeAnalytics.totalOutstanding)) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">
                        Collected: ${safeAnalytics.totalFeesCollected.toLocaleString()}
                      </span>
                      <span className="text-orange-600">
                        Outstanding: ${safeAnalytics.totalOutstanding.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        Paid Students
                      </span>
                      <span className="font-bold">{safeAnalytics.paidStudents}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        Pending Students
                      </span>
                      <span className="font-bold">{safeAnalytics.pendingStudents}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        Overdue Students
                      </span>
                      <span className="font-bold">{safeAnalytics.overdueStudents}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  );
}
