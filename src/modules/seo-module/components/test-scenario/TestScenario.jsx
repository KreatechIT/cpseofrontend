import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Edit, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import EditTestScenarioForm from "./EditTestScenarioForm";
import AddTestScenarioForm from "./AddTestScenarioForm";
import { fetchTestScenarios, deleteTestScenario } from "../../services/testScenarioService";
import {
  setTestScenarios,
  setLoading,
  setError,
} from "../../store/testScenarioSlice";
import { cn } from "@/utils/cn";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

const TestScenario = () => {
  const dispatch = useDispatch();
  const { testScenarios, loading, error, lastFetched } = useSelector(
    (state) => state.testScenario
  );

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSubProject, setSelectedSubProject] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [implDateRange, setImplDateRange] = useState({ from: null, to: null });
  const [startDateRange, setStartDateRange] = useState({
    from: null,
    to: null,
  });
  const [foundDateRange, setFoundDateRange] = useState({
    from: null,
    to: null,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scenarioToDelete, setScenarioToDelete] = useState(null);

  // Edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [scenarioToEdit, setScenarioToEdit] = useState(null);

  // Add dialog
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Load data only if not already loaded or stale (e.g., > 5 min old)
  useEffect(() => {
    const shouldFetch =
      !testScenarios.length ||
      !lastFetched ||
      Date.now() - lastFetched > 5 * 60 * 1000; // 5 minutes cache

    if (shouldFetch) {
      const loadData = async () => {
        dispatch(setLoading(true));
        try {
          const res = await fetchTestScenarios();
          dispatch(setTestScenarios(res));
        } catch (err) {
          dispatch(setError(err.message));
        }
      };
      loadData();
    }
  }, [dispatch, testScenarios.length, lastFetched]);

  // Extract unique filter options
  const projects = [
    ...new Set(testScenarios.map((item) => item.project)),
  ].filter(Boolean);
  const subProjects = [
    ...new Set(testScenarios.map((item) => item.sub_project)),
  ].filter(Boolean);
  const domains = [
    ...new Set(testScenarios.map((item) => item.unique_domain)),
  ].filter(Boolean);

  // Filtered & Paginated Data
  const filteredData = testScenarios.filter((row) => {
    const matchesSearch = searchQuery
      ? Object.values(row).some((val) =>
          val?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      : true;

    const matchesProject = selectedProject
      ? row.project === selectedProject
      : true;
    const matchesSubProject = selectedSubProject
      ? row.sub_project === selectedSubProject
      : true;
    const matchesDomain = selectedDomain
      ? row.unique_domain === selectedDomain
      : true;

    // Safe date parsing and comparison
    const parseDate = (dateStr) => {
      if (!dateStr) return null;
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? null : date;
    };

    const implDate = parseDate(row.implementation_date);
    const startDate = parseDate(row.start_date);
    const foundDate = parseDate(row.found_date);

    const matchesImplDate =
      (!implDateRange.from || (implDate && implDate >= implDateRange.from)) &&
      (!implDateRange.to || (implDate && implDate <= implDateRange.to));

    const matchesStartDate =
      (!startDateRange.from ||
        (startDate && startDate >= startDateRange.from)) &&
      (!startDateRange.to || (startDate && startDate <= startDateRange.to));

    const matchesFoundDate =
      (!foundDateRange.from ||
        (foundDate && foundDate >= foundDateRange.from)) &&
      (!foundDateRange.to || (foundDate && foundDate <= foundDateRange.to));

    return (
      matchesSearch &&
      matchesProject &&
      matchesSubProject &&
      matchesDomain &&
      matchesImplDate &&
      matchesStartDate &&
      matchesFoundDate
    );
  }).sort((a, b) => {
    // Sort by created_date descending (newest first)
    const dateA = new Date(a.created_date || 0);
    const dateB = new Date(b.created_date || 0);
    return dateB - dateA;
  });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(start, start + ITEMS_PER_PAGE);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedProject,
    selectedSubProject,
    selectedDomain,
    implDateRange,
    startDateRange,
    foundDateRange,
  ]);

  const getResultStrongColor = (result) => {
    switch (result?.toLowerCase()) {
      case "positive":
        return "bg-green-100 text-green-800 font-bold";
      case "negative":
        return "bg-red-100 text-red-800 font-bold";
      case "neutral":
        return "bg-yellow-100 text-yellow-800 font-bold";
      default:
        return "font-semibold";
    }
  };

  const handleEdit = (scenario) => {
    setScenarioToEdit(scenario);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (scenario) => {
    setScenarioToDelete(scenario);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!scenarioToDelete) return;

    try {
      await deleteTestScenario(scenarioToDelete.id);
      // Refresh the list
      const res = await fetchTestScenarios();
      dispatch(setTestScenarios(res));
      setDeleteDialogOpen(false);
      setScenarioToDelete(null);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleEditSuccess = async () => {
    // Refresh the list after successful edit
    try {
      const res = await fetchTestScenarios();
      dispatch(setTestScenarios(res));
    } catch (error) {
      console.error("Refresh failed:", error);
      toast.error("Failed to refresh list. Please reload the page.");
    }
  };

  const handleAddSuccess = async () => {
    // Refresh the list after successful add
    try {
      const res = await fetchTestScenarios();
      dispatch(setTestScenarios(res));
    } catch (error) {
      console.error("Refresh failed:", error);
      toast.error("Failed to refresh list. Please reload the page.");
    }
  };

  return (
    <div className="space-y-8 mt-6">
      {/* Header with Add Button */}
      <div className="flex justify-end">
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Test Scenario
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <Label className="mb-3">Search</Label>
          <Input
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div>
          <Label className="mb-3">Project</Label>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>All Projects</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-3">Sub Project</Label>
          <Select
            value={selectedSubProject}
            onValueChange={setSelectedSubProject}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Sub Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>All Sub Projects</SelectItem>
              {subProjects.map((sp) => (
                <SelectItem key={sp} value={sp}>
                  {sp}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-3">Domain</Label>
          <Select value={selectedDomain} onValueChange={setSelectedDomain}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Domains" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>All Domains</SelectItem>
              {domains.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-3">Implementation Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {implDateRange.from
                  ? implDateRange.to
                    ? `${format(implDateRange.from, 'dd/MM/yyyy')} - ${format(
                        implDateRange.to,
                        'dd/MM/yyyy'
                      )}`
                    : format(implDateRange.from, 'dd/MM/yyyy')
                  : "Select range"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="range"
                selected={implDateRange}
                onSelect={setImplDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label className="mb-3">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDateRange.from
                  ? startDateRange.to
                    ? `${format(startDateRange.from, 'dd/MM/yyyy')} - ${format(
                        startDateRange.to,
                        'dd/MM/yyyy'
                      )}`
                    : format(startDateRange.from, 'dd/MM/yyyy')
                  : "Select range"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="range"
                selected={startDateRange}
                onSelect={setStartDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label className="mb-3">Found Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {foundDateRange.from
                  ? foundDateRange.to
                    ? `${format(foundDateRange.from, "PP")} - ${format(
                        foundDateRange.to,
                        "PP"
                      )}`
                    : format(foundDateRange.from, "PP")
                  : "Select range"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="range"
                selected={foundDateRange}
                onSelect={setFoundDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Single Table */}
      <div className="border rounded-lg bg-card">
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Created Date</TableHead>
                {/* <TableHead>Note</TableHead> */}
                <TableHead>Test Scenario</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Sub Project</TableHead>
                <TableHead>Unique Domain</TableHead>
                <TableHead>Page/URL</TableHead>
                <TableHead>Hypothesis</TableHead>
                <TableHead>Expected Result</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Found Date</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead>Analysis</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Conclusion</TableHead>
                <TableHead>Next Steps</TableHead>
                <TableHead>Implementation Date</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => {
                  const globalIndex = start + index + 1;

                  return (
                    <TableRow key={row.id}>
                      <TableCell>{globalIndex}</TableCell>
                      <TableCell>
                        {row.created_date 
                          ? format(
                              new Date(row.created_date ),
                              "dd/MM/yyyy"
                            )
                          : "-"}
                      </TableCell>
                      {/* <TableCell>{row.note || "-"}</TableCell> */}
                      <TableCell>{row.test_scenario || "-"}</TableCell>
                      <TableCell>{row.project_name || "-"}</TableCell>
                      <TableCell>{row.sub_project || "-"}</TableCell>
                      <TableCell>{row.unique_domain || "-"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        <a
                          href={row.page_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {row.page_url || "-"}
                        </a>
                      </TableCell>
                      <TableCell className="whitespace-normal break-words">{row.hypothesis || "-"}</TableCell>
                      <TableCell>{row.expected_result || "-"}</TableCell>
                      <TableCell>
                        {row.start_date
                        ? format(
                            new Date(row.start_date),
                            "dd/MM/yyyy"
                          )
                        : "-"}
                      </TableCell>
                      <TableCell>
                        {row.found_date
                        ? format(
                            new Date(row.found_date),
                            "dd/MM/yyyy"
                          )
                        : "-"}
                      </TableCell>
                      <TableCell>{row.outcome || "-"}</TableCell>
                      <TableCell className="whitespace-normal break-words">{row.analysis || "-"}</TableCell>

                      {/* Only Result column gets stronger background + bold text */}
                      <TableCell
                        className={cn(
                          "font-semibold",
                          getResultStrongColor(row.result)
                        )}
                      >
                        {row.result || "-"}
                      </TableCell>

                      <TableCell className="whitespace-normal break-words">{row.conclusion || "-"}</TableCell>
                      <TableCell>{row.next_steps || "-"}</TableCell>
                      <TableCell>
                        {row.implementation_date
                        ? format(
                            new Date(row.implementation_date),
                            "dd/MM/yyyy"
                          )
                        : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(row)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteClick(row)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={18}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No test scenarios found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Central Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-4 flex justify-center">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          {scenarioToEdit && (
            <EditTestScenarioForm
              scenario={scenarioToEdit}
              onClose={() => {
                setEditDialogOpen(false);
                setScenarioToEdit(null);
              }}
              onSuccess={handleEditSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Test Scenario</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this test scenario? This action cannot be undone.
              {scenarioToDelete && (
                <div className="mt-2 p-2 bg-muted rounded">
                  <p className="font-medium">{scenarioToDelete.test_scenario}</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setScenarioToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <AddTestScenarioForm
            onClose={() => setAddDialogOpen(false)}
            onSuccess={handleAddSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestScenario;
