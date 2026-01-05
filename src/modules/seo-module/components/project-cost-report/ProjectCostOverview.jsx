import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, TrendingUp, TrendingDown, Check } from "lucide-react";
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

// Dummy data for table
const dummyTableData = [
  {
    account: "Vendor Alpha",
    status: "Paid",
    priceWithoutTaxUSD: 1200,
    no: "INV-001",
    project: "HealthWorks KL",
    pic: "Jamie Smith",
    createdDate: "2025-12-01",
    type: "Backlink",
    description: "Guest post on health blog",
    priceMYR: 5640,
    priceUSD: 1200,
    tax: 0,
    currencyRate: 4.7,
    documentation: "Yes",
    remark: "High DA site",
  },
  {
    account: "ServerHost Pro",
    status: "Pending",
    priceWithoutTaxUSD: 100,
    no: "INV-002",
    project: "Core System",
    pic: "Alex Chen",
    createdDate: "2025-12-05",
    type: "Servers",
    description: "Monthly hosting",
    priceMYR: 470,
    priceUSD: 100,
    tax: 0,
    currencyRate: 4.7,
    documentation: "Yes",
    remark: "",
  },
  {
    account: "Ahrefs",
    status: "Paid",
    priceWithoutTaxUSD: 399,
    no: "INV-003",
    project: "SEO Tools",
    pic: "Taylor Green",
    createdDate: "2025-12-10",
    type: "Tools",
    description: "Enterprise plan",
    priceMYR: 1875,
    priceUSD: 399,
    tax: 0,
    currencyRate: 4.7,
    documentation: "Yes",
    remark: "Annual renewal",
  },
  {
    account: "ContentWriter Co",
    status: "Paid",
    priceWithoutTaxUSD: 800,
    no: "INV-004",
    project: "HealthWorks KL",
    pic: "Jamie Smith",
    createdDate: "2025-12-15",
    type: "Content",
    description: "10 blog posts",
    priceMYR: 3760,
    priceUSD: 800,
    tax: 0,
    currencyRate: 4.7,
    documentation: "No",
    remark: "Medical niche",
  },
  {
    account: "DomainRegistry",
    status: "Paid",
    priceWithoutTaxUSD: 50,
    no: "INV-005",
    project: "New Domain",
    pic: "Wilson Lee",
    createdDate: "2025-12-20",
    type: "Domains",
    description: "Domain renewal x5",
    priceMYR: 235,
    priceUSD: 50,
    tax: 0,
    currencyRate: 4.7,
    documentation: "Yes",
    remark: "",
  },
];

const ProjectCostOverview = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [typeFilter, setTypeFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");

  const types = ["Backlink", "Servers", "Tools", "Content", "Domains"];
  const projects = ["HealthWorks KL", "Core System", "New Project"];

  return (
    <div className="space-y-8 mt-6">
      {/* 6 Cards in a Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* First Card - Double Width, Active */}
        <div className="md:col-span-2 bg-[#3872FA33] rounded-xl p-6 flex items-center justify-between">
          <div className="bg-blue-600 rounded-full p-4">
            <Check className="h-8 w-8 text-white" />
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold text-[#3872FA]">$12,450</div>
            <div className="text-2xl font-medium">RM48,450</div>
            <div className="text-lg text-[#3872FA] mt-2">Total Cost</div>
            <div className="flex items-center justify-end mt-2 text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">+8% this month</span>
            </div>
          </div>
        </div>

        {/* Other 5 Cards */}
        {["Servers", "Backlinks", "Domains", "Tools", "Content"].map((title, index) => (
          <div key={index} className="bg-muted rounded-xl p-6 text-center">
            <div className="text-2xl font-semibold">{title}</div>
            <div className="text-3xl font-bold mt-2">
              {title === "Servers" && "RM 400"}
              {title === "Backlinks" && "RM 15,200"}
              {title === "Domains" && "RM 1,200"}
              {title === "Tools" && "RM 8,500"}
              {title === "Content" && "RM 12,000"}
            </div>
            <div className="mt-2 flex items-center justify-center text-red-600">
              <TrendingDown className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">-2% this month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Label className="mb-3">Search</Label>
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
        </div>

        <div className="flex flex-wrap gap-4">
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
            <Label className="mb-3">Type</Label>
            <Select value={typeFilter ?? ""} onValueChange={(v) => setTypeFilter(v || null)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All Types</SelectItem>
                {types.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-[200px]">
            <Label className="mb-3">Project</Label>
            <Select value={projectFilter ?? ""} onValueChange={(v) => setProjectFilter(v || null)}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={null}>All Projects</SelectItem>
                {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                    {p.project_name}
                </SelectItem>
                ))}
            </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-card">
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Price Without Tax (USD)</TableHead>
                <TableHead>No</TableHead>
                <TableHead>Project/Project ID</TableHead>
                <TableHead>PIC</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Price (MYR)</TableHead>
                <TableHead className="text-right">Price (USD)</TableHead>
                <TableHead className="text-right">Tax</TableHead>
                <TableHead className="text-right">Currency Rate</TableHead>
                <TableHead>Documentation</TableHead>
                <TableHead>Remark</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyTableData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{row.account}</TableCell>
                  <TableCell>
                    <span className={row.status === "Paid" ? "text-green-600" : "text-yellow-600"}>
                      {row.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{row.priceWithoutTaxUSD.toLocaleString()}</TableCell>
                  <TableCell>{row.no}</TableCell>
                  <TableCell>{row.project}</TableCell>
                  <TableCell>{row.pic}</TableCell>
                  <TableCell>{row.createdDate}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell className="text-right">{row.priceMYR.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.priceUSD.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.tax}</TableCell>
                  <TableCell className="text-right">{row.currencyRate}</TableCell>
                  <TableCell>{row.documentation}</TableCell>
                  <TableCell>{row.remark || "-"}</TableCell>
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

export default ProjectCostOverview;