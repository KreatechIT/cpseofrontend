// src\modules\seo-module\pages\test-scenario\TestScenarioPage.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { getAllTestScenarios } from "../../services/testScenarioService"; // ← create this
import { PageHeading } from "@/components/shared/PageHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const ITEMS_PER_PAGE = 10;

const TestScenarioPage = () => {
  // const dispatch = useDispatch();
  const { testScenarios, loading } = useSelector((state) => state.testScenario); // ← assuming slice name

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // useEffect(() => {
  //   dispatch(getAllTestScenarios());
  // }, [dispatch]);

  // Filter logic
  const filteredData = testScenarios?.filter((item) => {
    const matchesSearch = searchQuery
      ? item.test_scenario?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hypothesis?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.project?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesStatus =
      statusFilter === "all" ? true : item.status === statusFilter;

    return matchesSearch && matchesStatus;
  }) || [];

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(start, start + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusBadge = (status) => {
    const colors = {
      Planned: "bg-yellow-100 text-yellow-800",
      Running: "bg-blue-100 text-blue-800",
      Completed: "bg-green-100 text-green-800",
      Paused: "bg-orange-100 text-orange-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return (
      <Badge className={colors[status] || "bg-gray-100 text-gray-800"}>
        {status || "Unknown"}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <PageHeading pageTitle="Test Scenarios" />
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create New Test Scenario
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by title, hypothesis or project..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9"
            />
          </div>
        </div>

        <div className="w-full md:w-48">
          <Label htmlFor="status">Status</Label>
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Planned">Planned</SelectItem>
              <SelectItem value="Running">Running</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Paused">Paused</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Loading test scenarios...</p>
        </div>
      ) : paginatedData.length === 0 ? (
        <div className="flex justify-center items-center h-64 text-muted-foreground">
          No test scenarios found
        </div>
      ) : (
        <div className="border rounded-lg">
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-12">No</TableHead>
                  <TableHead>Test Scenario</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Outcome</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{start + index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {item.test_scenario || item.hypothesis || "-"}
                    </TableCell>
                    <TableCell>{item.project || "-"}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      {item.start_date ? format(new Date(item.start_date), "dd MMM yyyy") : "-"}
                    </TableCell>
                    <TableCell>
                      {item.end_date ? format(new Date(item.end_date), "dd MMM yyyy") : "-"}
                    </TableCell>
                    <TableCell>{item.outcome || item.result || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <Pagination className="mt-6 flex justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 2 && page <= currentPage + 2)
              ) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              if (page === currentPage - 3 || page === currentPage + 3) {
                return <PaginationEllipsis key={page} />;
              }
              return null;
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default TestScenarioPage;