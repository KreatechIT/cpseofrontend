import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// Dummy data for the table
const dummyData = [
  {
    keyword: "buy shoes",
    highestRank: "#2",
    achievedDate: "28/02/2025",
    note: "Stable in top 3",
    "01/03/2025": "#2",
    "02/03/2025": "#1",
    "03/03/2025": "#3",
    "04/03/2025": "#2",
    "05/03/2025": "#4",
    "06/03/2025": "#2",
    "07/03/2025": "#1",
    "08/03/2025": "#3",
    "09/03/2025": "#2",
    "10/03/2025": "#5",
    "12/03/2025": "#3",
    "13/03/2025": "#2",
    "14/03/2025": "#1",
    "15/03/2025": "#4",
    "16/03/2025": "#2",
    "17/03/2025": "#3",
    "18/03/2025": "#1",
    "19/03/2025": "#2",
    "20/03/2025": "#5",
    "21/03/2025": "#3",
    "22/03/2025": "#2",
    "23/03/2025": "#1",
    "24/03/2025": "#4",
    "25/03/2025": "#2",
    "26/03/2025": "#3",
    "27/03/2025": "#1",
    "28/03/2025": "#2",
    "29/03/2025": "#5",
    "30/03/2025": "#3",
    "31/03/2025": "#2",
  },
  {
    keyword: "best running shoes",
    highestRank: "#1",
    achievedDate: "15/03/2025",
    note: "New entry",
    "01/03/2025": "#12",
    "02/03/2025": "#10",
    "03/03/2025": "#8",
    "04/03/2025": "#6",
    "05/03/2025": "#5",
    "06/03/2025": "#4",
    "07/03/2025": "#3",
    "08/03/2025": "#2",
    "09/03/2025": "#1",
    "10/03/2025": "#1",
    "12/03/2025": "#2",
    "13/03/2025": "#1",
    "14/03/2025": "#3",
    "15/03/2025": "#1",
    "16/03/2025": "#2",
    "17/03/2025": "#1",
    "18/03/2025": "#3",
    "19/03/2025": "#2",
    "20/03/2025": "#1",
    "21/03/2025": "#4",
    "22/03/2025": "#2",
    "23/03/2025": "#1",
    "24/03/2025": "#3",
    "25/03/2025": "#2",
    "26/03/2025": "#1",
    "27/03/2025": "#4",
    "28/03/2025": "#2",
    "29/03/2025": "#1",
    "30/03/2025": "#3",
    "31/03/2025": "#1",
  },
  {
    keyword: "cheap sneakers malaysia",
    highestRank: "#5",
    achievedDate: "20/03/2025",
    note: "Local intent",
    "01/03/2025": "#45",
    "02/03/2025": "#38",
    "03/03/2025": "#32",
    "04/03/2025": "#28",
    "05/03/2025": "#22",
    "06/03/2025": "#18",
    "07/03/2025": "#15",
    "08/03/2025": "#12",
    "09/03/2025": "#10",
    "10/03/2025": "#8",
    "12/03/2025": "#7",
    "13/03/2025": "#6",
    "14/03/2025": "#8",
    "15/03/2025": "#7",
    "16/03/2025": "#6",
    "17/03/2025": "#5",
    "18/03/2025": "#7",
    "19/03/2025": "#6",
    "20/03/2025": "#5",
    "21/03/2025": "#8",
    "22/03/2025": "#6",
    "23/03/2025": "#5",
    "24/03/2025": "#7",
    "25/03/2025": "#6",
    "26/03/2025": "#5",
    "27/03/2025": "#8",
    "28/03/2025": "#6",
    "29/03/2025": "#5",
    "30/03/2025": "#7",
    "31/03/2025": "#6",
  },
];

const SeRankingReport = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [seRankingFilter, setSeRankingFilter] = useState("");

  const seRankingOptions = ["All Rankings", "Top 10", "Top 50", "Top 100"];

  // Dynamic date columns from dummy data
  const dateColumns = Object.keys(dummyData[0] || {}).filter((key) =>
    key.match(/^\d{2}\/\d{2}\/\d{4}$/)
  );

  return (
    <div className="space-y-8 mt-6">
      {/* 6 Cards in a Row - All Same Width */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "TOP 1", value: "1/50" },
          { label: "Top 3", value: "2/50" },
          { label: "Top 5", value: "5/50" },
          { label: "Top 10", value: "6/50" },
          { label: "Top 30", value: "3/50" },
          { label: "Top 100", value: "4/50" },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-muted rounded-xl p-6 text-center border border-gray-200"
          >
            <div className="text-lg font-medium text-muted-foreground">{item.label}</div>
            <div className="text-5xl font-bold text-[#3872FA] mt-2">{item.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Label className="mb-3">Search</Label>
          <Input
            placeholder="Search keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
        </div>

        <div className="w-[200px]">
          <Label className="mb-3">SE Ranking</Label>
          <Select value={seRankingFilter} onValueChange={setSeRankingFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Rankings" />
            </SelectTrigger>
            <SelectContent>
              {seRankingOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
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
                  <TableHead key={date} className="text-center">
                    {date}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyData
                .filter((row) =>
                  searchQuery
                    ? row.keyword.toLowerCase().includes(searchQuery.toLowerCase())
                    : true
                )
                .map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.keyword}</TableCell>
                    <TableCell>{row.highestRank}</TableCell>
                    <TableCell>{row.achievedDate}</TableCell>
                    <TableCell>{row.note || "-"}</TableCell>
                    {dateColumns.map((date) => (
                      <TableCell key={date} className="text-center">
                        {row[date] || "-"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default SeRankingReport;