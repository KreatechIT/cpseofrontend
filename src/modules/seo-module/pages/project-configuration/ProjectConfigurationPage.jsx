import usePermission from "@/hooks/usePermission";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { setDialogData } from "@/store/reducers/dialogSlice";
import { TableSkeleton } from "@/components/ui/skeleton";
import { useEffect, useState, useMemo } from "react";
import SelectFilter from "@/components/filters/SelectFilter";
import {
  ClearFilterButton,
  FilterButton,
} from "@/components/filters/FilterButtons";
import { getAllProjects } from "../../services/projectService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Plus, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import axiosInstance from "@/services/axiosInstance";

const ProjectConfigurationPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { projects: allProjects } = useSelector((state) => state.projects);
  const navigate = useNavigate();
  const { hasPermission } = usePermission();

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!allProjects && user?.organisation_id) {
        setLoading(true);
        try {
          await getAllProjects(user.organisation_id, dispatch);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [user?.organisation_id, allProjects, dispatch]);

  const statusOptions = useMemo(() => {
    if (!allProjects) return [];
    return [...new Set(allProjects.map((p) => p.status).filter(Boolean))].map(
      (value) => ({
        value,
        label: value,
      }),
    );
  }, [allProjects]);

  const searchFiltered = useMemo(() => {
    if (!allProjects || !searchQuery) return allProjects || [];
    const term = searchQuery.toLowerCase();
    return allProjects.filter(
      (project) =>
        project.project_name?.toLowerCase().includes(term) ||
        project.sub_project_name?.toLowerCase().includes(term) ||
        project.project_id?.toLowerCase().includes(term) ||
        project.website?.toLowerCase().includes(term) ||
        project.keywords?.toLowerCase().includes(term) ||
        project.join?.toLowerCase().includes(term),
    );
  }, [allProjects, searchQuery]);

  const filteredProjects = useMemo(() => {
    let result = searchFiltered;
    if (isFilterApplied) {
      const statuses = Array.isArray(selectedStatuses) ? selectedStatuses : [];
      if (statuses.length > 0) {
        result = result.filter((p) => statuses.includes(p.status));
      }
      if (dateRange.from || dateRange.to) {
        result = result.filter((p) => {
          if (!p.due_date) return false;
          const due = new Date(p.due_date);
          if (dateRange.from && due < dateRange.from) return false;
          if (dateRange.to && due > dateRange.to) return false;
          return true;
        });
      }
    }
    return result;
  }, [searchFiltered, selectedStatuses, dateRange, isFilterApplied]);

  const handleApplyFilters = () => setIsFilterApplied(true);
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedStatuses([]);
    setDateRange({ from: null, to: null });
    setIsFilterApplied(false);
  };

  const handleAddProject = () => navigate("/seo/project-configuration/add");
  const handleEdit = (project) =>
    navigate(`/seo/project-configuration/edit/${project.id}`);
  // Local state for delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;

    setDeleting(true);
    try {
      // Call your DELETE API
      await axiosInstance.delete(`/seo/projects/${projectToDelete.id}/`);

      toast.success(
        `"${projectToDelete.project_name}" has been deleted successfully.`,
      );

      // Refetch projects to update the table
      await getAllProjects(user.organisation_id, dispatch);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete project. Please try again.");
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setProjectToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setProjectToDelete(null);
  };

  return (
    <>
      <title>Project Configuration - Core360</title>
      <main className="mt-1 flex h-full flex-col p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-sans text-2xl font-medium">
            Project Configuration
          </h2>
          <Button onClick={handleAddProject}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Project
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap items-end gap-4">
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xl"
            />

            <SelectFilter
              title="Status"
              options={statusOptions}
              selected={selectedStatuses}
              setSelected={setSelectedStatuses}
            />

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[280px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from
                    ? dateRange.to
                      ? `${format(dateRange.from, "dd MMM yyyy")} - ${format(dateRange.to, "dd MMM yyyy")}`
                      : format(dateRange.from, "dd MMM yyyy")
                    : "Due Date Range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            <FilterButton onClick={handleApplyFilters} />

            {isFilterApplied && (
              <ClearFilterButton onClick={handleClearFilters} />
            )}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <TableSkeleton />
        ) : (
          <ScrollArea className="rounded-md border h-[calc(100vh-300px)]">
            <Table>
              <TableHeader
                className="sticky top-0 z-10"
                style={{ background: "#3872FA33" }}
              >
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Sub Project</TableHead>
                  <TableHead>Project ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>PIC</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead className="text-right">Impressions</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead>Join</TableHead>
                  <TableHead>Keywords</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">
                        {project.project_name}
                      </TableCell>
                      <TableCell>{project.sub_project_name || "-"}</TableCell>
                      <TableCell>{project.project_id || "-"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            project.status === "Active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {project.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {project.website ? (
                          <a
                            href={project.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {project.website}
                          </a>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>{project.pic_name || "-"}</TableCell>
                      <TableCell>{project.owner_name || "-"}</TableCell>
                      <TableCell className="text-right">
                        {project.impressions?.toLocaleString() || "0"}
                      </TableCell>
                      <TableCell className="text-right">
                        {project.clicks?.toLocaleString() || "0"}
                      </TableCell>
                      <TableCell className="max-w-[100px] truncate text-right">
                        {project.join || "-"}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {project.keywords || "-"}
                      </TableCell>
                      <TableCell>
                        {project.due_date
                          ? format(new Date(project.due_date), "dd/MM/yyyy")
                          : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleEdit(project)}
                            style={{ backgroundColor: "#00BA3B" }}
                            className="text-white hover:opacity-90"
                          >
                            <Edit className="h-4 w-4" /> Edit
                          </Button>

                          {/* {hasPermission("seo_project.delete") && ( */}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteClick(project)}
                          >
                            <Trash2 className="h-4 w-4" /> Delete
                          </Button>
                          {/* )} */}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={13}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No projects found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
        {/* Delete Confirmation Modal */}
        <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                Delete Project
              </DialogTitle>
            </DialogHeader>

            <DialogDescription className="text-center space-y-4 py-4">
              <p className="text-base">
                Are you sure you want to delete the project
                <span className="font-bold text-foreground mx-1">
                  "{projectToDelete?.project_name}"
                </span>
                ?
              </p>
              <p className="text-destructive font-medium">
                This action cannot be undone.
              </p>
              <p className="text-sm text-muted-foreground">
                All associated data will be permanently removed.
              </p>
            </DialogDescription>

            <DialogFooter className="flex gap-3 sm:justify-center">
              <Button
                variant="outline"
                onClick={handleCancelDelete}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Yes, Delete Project"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
};

export default ProjectConfigurationPage;
