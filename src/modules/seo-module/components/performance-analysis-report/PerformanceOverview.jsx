import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
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

// Dummy data for demo
const dummyData = [
  {
    date: "2025-12-01",
    impressions: 1200,
    clicks: 85,
    ctr: "7.08%",
    note: "Strong performance",
    position: "12.4",
    firstDeposit: 150,
    totalUser: 320,
    totalDeposit: 2450,
    organicSearch: 180,
    direct: 80,
    referral: 30,
    organicSocial: 20,
    unassigned: 10,
    totalInquiry: 45,
    inquiryDownload: 25,
    inquiryWhatsapp: 20,
    register: 12,
    join: 8,
  },
  {
    date: "2025-12-02",
    impressions: 1350,
    clicks: 92,
    ctr: "6.81%",
    note: "",
    position: "11.8",
    firstDeposit: 180,
    totalUser: 350,
    totalDeposit: 2800,
    organicSearch: 200,
    direct: 90,
    referral: 35,
    organicSocial: 15,
    unassigned: 10,
    totalInquiry: 52,
    inquiryDownload: 30,
    inquiryWhatsapp: 22,
    register: 15,
    join: 10,
  },
  {
    date: "2025-12-03",
    impressions: 1100,
    clicks: 78,
    ctr: "7.09%",
    note: "Holiday dip",
    position: "13.2",
    firstDeposit: 120,
    totalUser: 280,
    totalDeposit: 1900,
    organicSearch: 150,
    direct: 70,
    referral: 25,
    organicSocial: 25,
    unassigned: 10,
    totalInquiry: 38,
    inquiryDownload: 20,
    inquiryWhatsapp: 18,
    register: 10,
    join: 6,
  },
  {
    date: "2025-12-04",
    impressions: 1450,
    clicks: 105,
    ctr: "7.24%",
    note: "Campaign boost",
    position: "10.9",
    firstDeposit: 220,
    totalUser: 410,
    totalDeposit: 3400,
    organicSearch: 240,
    direct: 100,
    referral: 40,
    organicSocial: 20,
    unassigned: 10,
    totalInquiry: 65,
    inquiryDownload: 38,
    inquiryWhatsapp: 27,
    register: 20,
    join: 14,
  },
  {
    date: "2025-12-05",
    impressions: 1300,
    clicks: 95,
    ctr: "7.31%",
    note: "",
    position: "11.5",
    firstDeposit: 190,
    totalUser: 370,
    totalDeposit: 2950,
    organicSearch: 210,
    direct: 95,
    referral: 35,
    organicSocial: 20,
    unassigned: 10,
    totalInquiry: 58,
    inquiryDownload: 32,
    inquiryWhatsapp: 26,
    register: 18,
    join: 12,
  },
];

const PerformanceOverview = () => {
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [compareProject, setCompareProject] = useState("");
  const [period, setPeriod] = useState("day");

  // Mock options
  const projects = ["Project A", "Project B", "Project C"];
  const periods = ["Per Day", "Per Week", "Per Month", "Per Year"];

  return (
    <div className="space-y-8">
      {/* Filters - Right aligned */}
      <div className="flex justify-end gap-4 flex-wrap">
        <div className="w-[280px]">
          <Label className="mb-3">Date Range</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from
                  ? dateRange.to
                    ? `${format(dateRange.from, "PPP")} - ${format(dateRange.to, "PPP")}`
                    : format(dateRange.from, "PPP")
                  : "Select range"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
            </PopoverContent>
          </Popover>
        </div>

        <div className="w-[200px]">
          <Label className="mb-3">Compare Project</Label>
          <Select value={compareProject} onValueChange={setCompareProject}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-[200px]">
          <Label className="mb-3">Period</Label>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Per Day" />
            </SelectTrigger>
            <SelectContent>
              {periods.map((p) => (
                <SelectItem key={p} value={p.toLowerCase().replace("per ", "")}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Data Table */}
      <div className="border rounded-lg bg-card">
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Impression</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">CTR</TableHead>
                <TableHead>Note</TableHead>
                <TableHead className="text-right">Position</TableHead>
                <TableHead className="text-right">First Deposit</TableHead>
                <TableHead className="text-right">Total User</TableHead>
                <TableHead className="text-right">Total Deposit</TableHead>
                <TableHead className="text-right">Organic Search</TableHead>
                <TableHead className="text-right">Direct</TableHead>
                <TableHead className="text-right">Referral</TableHead>
                <TableHead className="text-right">Organic Social</TableHead>
                <TableHead className="text-right">Unassigned</TableHead>
                <TableHead className="text-right">Total Inquiry</TableHead>
                <TableHead className="text-right">Inquiry (Download)</TableHead>
                <TableHead className="text-right">Inquiry (WhatsApp)</TableHead>
                <TableHead className="text-right">Register</TableHead>
                <TableHead className="text-right">Join</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{row.date}</TableCell>
                  <TableCell className="text-right">{row.impressions.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.clicks}</TableCell>
                  <TableCell className="text-right">{row.ctr}</TableCell>
                  <TableCell>{row.note || "-"}</TableCell>
                  <TableCell className="text-right">{row.position}</TableCell>
                  <TableCell className="text-right">{row.firstDeposit.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.totalUser.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.totalDeposit.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.organicSearch.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.direct.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.referral.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.organicSocial.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.unassigned.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.totalInquiry.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.inquiryDownload.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.inquiryWhatsapp.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.register.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.join.toLocaleString()}</TableCell>
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

export default PerformanceOverview;