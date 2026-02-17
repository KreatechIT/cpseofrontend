import { useState, useEffect } from "react";
import { PageHeading } from "@/components/shared/PageHeading";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
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
import axiosInstance from "@/services/axiosInstance";
import { toast } from "sonner";

const AhrefsReportPage = () => {
  const [projects, setProjects] = useState([]); // From seo/projects/
  const [competitors, setCompetitors] = useState([]); // From Ahrefs filters
  const [ahrefsData, setAhrefsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selected values
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedCompetitor, setSelectedCompetitor] = useState("");

  // Fetch all projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axiosInstance.get("/seo/projects/");
        setProjects(res.data || []);

        // Default select first project
        if (res.data?.length > 0) {
          setSelectedProject(res.data[0].project_id);
        }
      } catch (err) {
        toast.error("Failed to load projects");
        console.error(err);
      }
    };

    fetchProjects();
  }, []);

  // Fetch Ahrefs data when project or competitor changes
  useEffect(() => {
    if (!selectedProject) return; // Don't fetch until project is selected

    const fetchAhrefs = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `https://staging-api.corepath360.com/seo/ahrefs/report/?data_type=project&project_id=${selectedProject}`;

        // If competitor selected, switch to competitor mode
        if (selectedCompetitor) {
          url = `https://staging-api.corepath360.com/seo/ahrefs/report/?data_type=competitor&project_id=${selectedProject}&company=${encodeURIComponent(
            selectedCompetitor,
          )}`;
        }

        const res = await axiosInstance.get(url);
        setAhrefsData(res.data.results || []);

        // Update competitors list from filters (only when no competitor selected yet)
        if (!selectedCompetitor && res.data.filters?.available_companies) {
          setCompetitors(
            res.data.filters.available_companies.map((c) => c.name),
          );
        }
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load Ahrefs data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAhrefs();
  }, [selectedProject, selectedCompetitor]);

  if (loading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Loading Ahrefs Report...
      </div>
    );
  }

  if (error || !ahrefsData.length) {
    return (
      <div className="text-center py-12 text-red-600">
        No data available or error loading.
      </div>
    );
  }

  return (
    <>
      <title>Ahrefs Report - Core360</title>
      <main className="mt-1 flex h-full flex-col p-6">
        {/* Filters - Right side only */}
        <div className="flex justify-end gap-6 mb-8 flex-wrap">
          <div className="w-[300px]">
            <Label className="mb-3">Project Select</Label>
            <Select
              value={selectedProject || null}
              onValueChange={(val) => setSelectedProject(val ?? null)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Project" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value={null}>All Projects</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.project_id} value={p.project_id}>
                    {p.project_id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-[300px]">
            <Label className="mb-3">Competitor Select</Label>
            <Select
              value={selectedCompetitor}
              onValueChange={setSelectedCompetitor}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Competitor (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All Competitors</SelectItem>
                {competitors.map((comp) => (
                  <SelectItem key={comp} value={comp}>
                    {comp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Single Data Table */}
        <div className="border rounded-lg bg-card">
          <ScrollArea className="h-[700px]">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead>Unique Domain</TableHead>
                  <TableHead>Live Link</TableHead>
                  {/* <TableHead>Account</TableHead> */}
                  <TableHead>Domain Rating</TableHead>
                  <TableHead>URL Rating</TableHead>
                  <TableHead>Domain Traffic</TableHead>
                  <TableHead>Referring Domains</TableHead>
                  <TableHead>Linked Domains</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>External Links</TableHead>
                  <TableHead>Page Traffic</TableHead>
                  <TableHead>Total Organic Keywords</TableHead>
                  <TableHead>Target URL</TableHead>
                  <TableHead>Anchor Text</TableHead>
                  <TableHead>Redirect Chain URLs</TableHead>
                  <TableHead>Redirect Chain Status Codes</TableHead>
                  <TableHead>Follow</TableHead>
                  <TableHead>First Seen</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead>Lost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ahrefsData.map((row, index) => (
                  <TableRow key={row.id || index}>
                    <TableCell>{row.unique_domain || "-"}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      <a
                        href={row.live_link_full || row.live_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {row.live_link || "-"}
                      </a>
                    </TableCell>
                    {/* <TableCell>{row.vendor || "Ahrefs Import"}</TableCell> */}
                    <TableCell>{row.domain_rating || "-"}</TableCell>
                    <TableCell>{row.url_rating || "-"}</TableCell>
                    <TableCell>{row.domain_traffic || "-"}</TableCell>
                    <TableCell>{row.referring_domains || "-"}</TableCell>
                    <TableCell>{row.linked_domains || "-"}</TableCell>
                    <TableCell>
                      {row.lost === null ? "Active" : "Lost"}
                    </TableCell>
                    <TableCell>{row.external_links || "-"}</TableCell>
                    <TableCell>{row.page_traffic || "-"}</TableCell>
                    <TableCell>{row.total_organic_keywords || "-"}</TableCell>
                    <TableCell>{row.target_url || "-"}</TableCell>
                    <TableCell>{row.anchor_text || "-"}</TableCell>
                    <TableCell>{row.redirect_chain_urls || "-"}</TableCell>
                    <TableCell>
                      {row.redirect_chain_status_codes || "-"}
                    </TableCell>
                    <TableCell>
                      {row.follow === "Follow"
                        ? "Yes"
                        : row.follow === "NoFollow"
                          ? "No"
                          : "-"}
                    </TableCell>
                    <TableCell>
                      {row.first_seen
                        ? format(new Date(row.first_seen), "dd/MM/yyyy")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {row.last_seen
                        ? format(new Date(row.last_seen), "dd/MM/yyyy")
                        : "-"}
                    </TableCell>
                    <TableCell>{row.lost === null ? "No" : "Yes"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </main>
    </>
  );
};

export default AhrefsReportPage;
