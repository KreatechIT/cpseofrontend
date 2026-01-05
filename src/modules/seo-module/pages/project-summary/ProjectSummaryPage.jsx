import usePermission from "@/hooks/usePermission";
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
import { CalendarIcon } from "lucide-react";
import ProjectHistoryDrawer from "../../components/history/ProjectHistoryDrawer";
import axiosInstance from "@/services/axiosInstance";

const ProjectSummaryPage = () => {
  const dispatch = useDispatch();
  const { hasPermission } = usePermission();
  const { user } = useSelector((state) => state.auth);
  const { projects: allProjects } = useSelector((state) => state.projects);

  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedPics, setSelectedPics] = useState([]);
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

  const openHistoryDrawer = () => {
    dispatch(
      setDialogData({
        type: "projectHistoryLog",
        side: "left",
        styles: "w-full max-w-md h-full",
      })
    );
  };

  // Dropdown options
  const statusOptions = useMemo(() => {
    if (!allProjects) return [];
    return [...new Set(allProjects.map((p) => p.status).filter(Boolean))].map(
      (value) => ({
        value,
        label: value,
      })
    );
  }, [allProjects]);

  const locationOptions = useMemo(() => {
    if (!allProjects) return [];
    return [
      ...new Set(allProjects.map((p) => p.server_location).filter(Boolean)),
    ].map((value) => ({
      value,
      label: value || "Unknown",
    }));
  }, [allProjects]);

  const picOptions = useMemo(() => {
    if (!allProjects) return [];
    return [...new Set(allProjects.map((p) => p.pic).filter(Boolean))].map(
      (value) => ({
        value,
        label: value || "Unassigned",
      })
    );
  }, [allProjects]);

  // Live search only
  const searchFiltered = useMemo(() => {
    if (!allProjects || !searchQuery) return allProjects || [];

    const term = searchQuery.toLowerCase();
    return allProjects.filter(
      (project) =>
        project.project_name?.toLowerCase().includes(term) ||
        project.sub_project_name?.toLowerCase().includes(term) ||
        project.website?.toLowerCase().includes(term) ||
        project.keywords?.toLowerCase().includes(term)
    );
  }, [allProjects, searchQuery]);

  // Final filtered result — only after Apply
  const filteredProjects = useMemo(() => {
    let result = searchFiltered;

    if (isFilterApplied) {
      // Safely convert to arrays
      const statuses = Array.isArray(selectedStatuses) ? selectedStatuses : [];
      const locations = Array.isArray(selectedLocations)
        ? selectedLocations
        : [];
      const pics = Array.isArray(selectedPics) ? selectedPics : [];

      if (statuses.length > 0) {
        result = result.filter((p) => statuses.includes(p.status));
      }
      if (locations.length > 0) {
        result = result.filter((p) => locations.includes(p.server_location));
      }
      if (pics.length > 0) {
        result = result.filter((p) => pics.includes(p.pic));
      }
      if (dateRange.from || dateRange.to) {
        result = result.filter((p) => {
          if (!p.domain_expires) return false;
          const exp = new Date(p.domain_expires);
          if (dateRange.from && exp < dateRange.from) return false;
          if (dateRange.to && exp > dateRange.to) return false;
          return true;
        });
      }
    }

    return result;
  }, [
    searchFiltered,
    selectedStatuses,
    selectedLocations,
    selectedPics,
    dateRange,
    isFilterApplied,
  ]);

  const handleApplyFilters = () => {
    setIsFilterApplied(true);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedStatuses([]);
    setSelectedLocations([]);
    setSelectedPics([]);
    setDateRange({ from: null, to: null });
    setIsFilterApplied(false);
  };

  const isAnyFilterActive =
    searchQuery ||
    (Array.isArray(selectedStatuses) && selectedStatuses.length > 0) ||
    (Array.isArray(selectedLocations) && selectedLocations.length > 0) ||
    (Array.isArray(selectedPics) && selectedPics.length > 0) ||
    dateRange.from;

  const [projectHistoryLogs, setProjectHistoryLogs] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Fetch history on mount or when needed
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.organisation_id) return;
      setHistoryLoading(true);
      try {
        // Replace with your actual endpoint
        const res = await axiosInstance.get(`/seo/projects/history/`);
        // Or if per-project: `/seo/projects/${projectId}/history/`
        setProjectHistoryLogs(res.data);
      } catch (err) {
        console.error("Failed to load history:", err);
        setProjectHistoryLogs([]);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchHistory();
  }, [user?.organisation_id]);
  return (
    <>
      <title>Project Summary - Core360</title>
      <main className="mt-1 flex h-full flex-col p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-sans text-2xl font-medium">Project Summary</h2>
          {/* Pass real history data here */}
          <ProjectHistoryDrawer historyLogs={projectHistoryLogs}>
            <Button variant="outline">History Log</Button>
          </ProjectHistoryDrawer>
        </div>
        {/* Filters — Same pattern as EmployeeDatabase */}
        <div className="mb-6">
          <div className="flex flex-wrap items-end gap-4">
            <Input
              placeholder="Search project, website, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />

            <SelectFilter
              title="Status"
              options={statusOptions}
              selected={selectedStatuses}
              setSelected={setSelectedStatuses}
            />

            <SelectFilter
              title="Server Location"
              options={locationOptions}
              selected={selectedLocations}
              setSelected={setSelectedLocations}
            />

            <SelectFilter
              title="PIC"
              options={picOptions}
              selected={selectedPics}
              setSelected={setSelectedPics}
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
                      ? `${format(dateRange.from, "dd MMM yyyy")} - ${format(
                          dateRange.to,
                          "dd MMM yyyy"
                        )}`
                      : format(dateRange.from, "dd MMM yyyy")
                    : "Domain Expiration"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            <FilterButton onClick={handleApplyFilters} />

            {isAnyFilterActive && (
              <ClearFilterButton onClick={handleClearFilters} />
            )}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <TableSkeleton />
        ) : (
          <ScrollArea className="rounded-md border h-[calc(100vh-280px)]">
            <Table>
              <TableHeader
                className="sticky top-0 z-10"
                style={{ background: "#3872FA33" }}
              >
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Sub Project</TableHead>
                  {/* <TableHead>Note</TableHead> Remark data used here */}
                  <TableHead>Project ID</TableHead>
                  <TableHead>Unique Domain</TableHead>
                  <TableHead>PIC</TableHead>
                  <TableHead>Reporting</TableHead>
                  <TableHead>Project Launched Date</TableHead>
                  <TableHead>Domain Created Date</TableHead>
                  <TableHead>Domain Expiration Date</TableHead>
                  <TableHead>Domain Expiration Day Left</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Server Location</TableHead>
                  <TableHead>Web Server</TableHead>
                  <TableHead>Login IPs</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => {
                    // Expiration Logic
                    const daysLeft = project.domain_expires
                      ? Math.ceil(
                          (new Date(project.domain_expires) - new Date()) /
                            (1000 * 60 * 60 * 24)
                        )
                      : null;

                    // Demo Remark Data
                    const demoRemark = "10/03/2025 \n To feed";

                    return (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">
                          {project.project_name}
                        </TableCell>
                        <TableCell>{project.sub_project_name || "-"}</TableCell>

                        {/* Note column with Demo Data */}
                        {/* <TableCell className="whitespace-pre-line text-xs text-blue-600">
                          {project.remarks || demoRemark}
                        </TableCell> */}

                        <TableCell>{project.project_id || "-"}</TableCell>
                        <TableCell>
                          {project.website ? (
                            <a
                              href={project.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {project.website.replace(/(^\w+:|^)\/\//, "")}
                            </a>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="text-[10px] uppercase">
                          {project.pic?.split("-")[0] || "-"}
                        </TableCell>
                        <TableCell>
                          <div className="text-[10px] leading-tight">
                            <span className="text-gray-500">I:</span>{" "}
                            {project.impressions?.toLocaleString()} <br />
                            <span className="text-gray-500">C:</span>{" "}
                            {project.clicks?.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          {project.launched_date
                            ? format(
                                new Date(project.launched_date),
                                "dd/MM/yyyy"
                              )
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {project.domain_created
                            ? format(
                                new Date(project.domain_created),
                                "dd/MM/yyyy"
                              )
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {project.domain_expires
                            ? format(
                                new Date(project.domain_expires),
                                "dd/MM/yyyy"
                              )
                            : "-"}
                        </TableCell>
                        <TableCell
                          className={
                            daysLeft !== null && daysLeft < 30
                              ? "text-red-600 font-bold"
                              : ""
                          }
                        >
                          {daysLeft !== null ? `${daysLeft} Days` : "-"}
                        </TableCell>
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
                        <TableCell>{project.server_location || "-"}</TableCell>
                        <TableCell>{project.web_server || "-"}</TableCell>
                        <TableCell>{project.login_ips || "-"}</TableCell>

                        {/* Remarks column with Demo Data */}
                        <TableCell className="whitespace-pre-line">
                          {project.remarks || demoRemark}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={16} className="h-24 text-center">
                      No data available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </main>
    </>
  );
};

export default ProjectSummaryPage;
