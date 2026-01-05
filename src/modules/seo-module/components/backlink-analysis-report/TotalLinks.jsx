import { useState } from "react";
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
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const TotalLinks = () => {
  const [linkTypeSearch, setLinkTypeSearch] = useState("");
  const [dateFilter, setDateFilter] = useState({ from: null, to: null });
  const [compareProject, setCompareProject] = useState("");
  const [domain, setDomain] = useState("");
  const [orderMonth, setOrderMonth] = useState("");
  const [linkType, setLinkType] = useState("");

  // Mock data for pie chart
  const pieData = [
    { name: "Vendor A", value: 50, color: "#80CBC4" },
    { name: "Vendor B", value: 10, color: "#284654" },
    { name: "Vendor C", value: 10, color: "#E9C46B" },
    { name: "Vendor D", value: 10, color: "#F4A361" },
    { name: "Vendor E", value: 10, color: "#E66E51" },
  ];

  // Mock options for dropdowns
  const mockOptions = ["Option 1", "Option 2", "Option 3"]; // Replace with API data

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div>
          <Label className="mb-3">Search by Link Type</Label>
          <Input value={linkTypeSearch} onChange={(e) => setLinkTypeSearch(e.target.value)} placeholder="Search..." />
        </div>

        <div>
          <Label className="mb-3">Date Wise Filter</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFilter.from
                  ? dateFilter.to
                    ? `${format(dateFilter.from, "PPP")} - ${format(dateFilter.to, "PPP")}`
                    : format(dateFilter.from, "PPP")
                  : "Select date range"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="range" selected={dateFilter} onSelect={setDateFilter} numberOfMonths={2} />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label className="mb-3">Compare Project</Label>
          <Select value={compareProject} onValueChange={setCompareProject}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {mockOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-3">Domain</Label>
          <Select value={domain} onValueChange={setDomain}>
            <SelectTrigger  className="w-full">
              <SelectValue placeholder="Select domain" />
            </SelectTrigger>
            <SelectContent>
              {mockOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-3">Order Month</Label>
          <Select value={orderMonth} onValueChange={setOrderMonth}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {mockOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-3">Link Type</Label>
          <Select value={linkType} onValueChange={setLinkType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select link type" />
            </SelectTrigger>
            <SelectContent>
              {mockOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="border p-6 rounded-lg bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Total Links</h3>
          <Select value={compareProject} onValueChange={setCompareProject} className="w-[200px]">
            <SelectTrigger>
              <SelectValue placeholder="Compare Project" />
            </SelectTrigger>
            <SelectContent>
              {mockOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-center">
          <PieChart width={600} height={400}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* Bottom Vendor Bar */}
        <div className="flex justify-center gap-4 mt-6">
          {pieData.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-4 h-4" style={{ backgroundColor: entry.color }}></div>
              <span>{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TotalLinks;