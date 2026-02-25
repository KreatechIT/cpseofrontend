import { useState, useEffect } from "react";
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
import { format } from "date-fns";

const SeRankingReport = () => {
  const [rankingData, setRankingData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [positionOverview, setPositionOverview] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [reportType, setReportType] = useState("se-ranking");

  const reportOptions = [
    { value: "se-ranking", label: "SE Ranking" },
    { value: "se-status", label: "SE Status" },
  ];

  useEffect(() => {
    const fetchBoth = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get current month date range (1st of month to today)
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        
        const dateFrom = format(firstDayOfMonth, "dd/MM/yyyy");
        const dateTo = format(today, "dd/MM/yyyy");

        // SE Ranking Report with date filter
        const rankingRes = await axiosInstance.get(
          `/seo/se-ranking-report/?date_from=${dateFrom}&date_to=${dateTo}`
        );
        setRankingData(rankingRes.data.keywords || []);
        setPositionOverview(rankingRes.data.position_overview || {});

        // SE Status
        const statusRes = await axiosInstance.get("/seo/se-status/");
        setStatusData(statusRes.data.backlinks || []);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBoth();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12 text-muted-foreground">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">Error loading data.</div>
    );
  }

  // ── SE Ranking Table Logic ────────────────────────────────────────────────
  // Collect ALL possible dates from ALL rows that have proper daily_rankings object
  const allDates = new Set();
  rankingData.forEach((row) => {
    if (
      row.daily_rankings &&
      typeof row.daily_rankings === "object" &&
      !Array.isArray(row.daily_rankings)
    ) {
      Object.keys(row.daily_rankings).forEach((date) => {
        if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
          allDates.add(date);
        }
      });
    }
  });

  // Sort dates chronologically
  const dateColumns = Array.from(allDates).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const filteredRanking = rankingData.filter((row) =>
    searchQuery
      ? row.keyword?.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  // ── SE Status Table Logic ─────────────────────────────────────────────────
  const statusColumns = [
    "Unique Domain",
    "Live Link",
    "Status",
    "Note",
    "Link Status",
    "Target URL",
    "Anchor Text",
    "Follow",
    "Purchase Date",
    "Vendor",
  ];

  return (
    <div className="space-y-8 mt-6">
      {/* Cards - only for SE Ranking */}
      {reportType === "se-ranking" && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "TOP 1", value: positionOverview.top_1 || "0/0" },
            { label: "Top 3", value: positionOverview.top_3 || "0/0" },
            { label: "Top 5", value: positionOverview.top_5 || "0/0" },
            { label: "Top 10", value: positionOverview.top_10 || "0/0" },
            { label: "Top 30", value: positionOverview.top_30 || "0/0" },
            { label: "Top 100", value: positionOverview.top_100 || "0/0" },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-muted rounded-xl p-6 text-center border border-gray-200"
            >
              <div className="text-lg font-medium text-muted-foreground">
                {item.label}
              </div>
              <div className="text-5xl font-bold text-[#3872FA] mt-2">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Label className="mb-3">Search</Label>
          <Input
            placeholder="Search keyword / domain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
        </div>

        <div className="w-[200px]">
          <Label className="mb-3">Report Type</Label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="SE Ranking" />
            </SelectTrigger>
            <SelectContent>
              {reportOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Conditional Table */}
      {reportType === "se-ranking" ? (
        // SE Ranking Table (Keyword Rankings)
        <div className="border rounded-lg bg-card">
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead>Keyword</TableHead>
                  <TableHead>Highest Rank</TableHead>
                  <TableHead>Achieved Date</TableHead>
                  <TableHead>Note</TableHead>
                  {dateColumns.map((date) => (
                    <TableHead key={date} className="text-center min-w-[80px]">
                      {format(new Date(date), "dd/MM/yyyy")}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRanking.length > 0 ? (
                  filteredRanking.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {row.keyword || "-"}
                      </TableCell>
                      <TableCell>{row.highest_ranking || "-"}</TableCell>
                      <TableCell>{row.achieved_date || "-"}</TableCell>
                      <TableCell>{row.note || "-"}</TableCell>
                      {dateColumns.map((date) => (
                        <TableCell key={date} className="text-center">
                          {row.daily_rankings &&
                          typeof row.daily_rankings === "object"
                            ? row.daily_rankings[date] ?? "-"
                            : "-"}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={dateColumns.length + 4}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No ranking data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      ) : (
        // SE Status Table (Backlinks)
        <div className="border rounded-lg bg-card">
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead>Unique Domain</TableHead>
                  <TableHead>Live Link</TableHead>
                  <TableHead>Status</TableHead>
                  {/* <TableHead>Note</TableHead> */}
                  <TableHead>Link Status</TableHead>
                  <TableHead>Target URL</TableHead>
                  <TableHead>Anchor Text</TableHead>
                  <TableHead>Follow</TableHead>
                  <TableHead>Purchase Date</TableHead>
                  <TableHead>Vendor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statusData.length > 0 ? (
                  statusData.map((row, index) => (
                    <TableRow key={index}>
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
                      <TableCell>{row.status || "-"}</TableCell>
                      {/* <TableCell>{row.note || "-"}</TableCell> */}
                      <TableCell>{row.link_status || "-"}</TableCell>
                      <TableCell>{row.target_url || "-"}</TableCell>
                      <TableCell>{row.anchor_text || "-"}</TableCell>
                      <TableCell>{row.follow || "-"}</TableCell>
                      <TableCell>{row.purchase_date || "-"}</TableCell>
                      <TableCell>{row.vendor || "-"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No backlink status data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default SeRankingReport;
