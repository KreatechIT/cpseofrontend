import { useState, useEffect } from "react";
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
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { format, subDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/utils/cn";

const PerformanceOverview = ({ overview }) => {
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 28), // default: last 28 days
    to: new Date(),
  });
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [period, setPeriod] = useState("day");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!overview?.projects?.length) return;

    // First time: select first 2 projects
    if (selectedProjects.length === 0) {
      const firstTwo = overview.projects.slice(0, 2).map(p => p.project_id);
      setSelectedProjects(firstTwo);
    }
  }, [overview]);

  // Filter data per project + date range
  const filteredDataByProject = {};
  selectedProjects.forEach(projectId => {
    const project = overview.projects.find(p => p.project_id === projectId);
    if (!project) return;

    let filtered = project.data || [];
    if (dateRange.from || dateRange.to) {
      filtered = filtered.filter(row => {
        const rowDate = new Date(row.period);
        if (dateRange.from && rowDate < dateRange.from) return false;
        if (dateRange.to && rowDate > dateRange.to) return false;
        return true;
      });
    }

    filteredDataByProject[project.project_name || project.project_id] = filtered;
  });

  // Calculate global totals (for cards)
  let totals = {
    totalClicks: 0,
    totalImpressions: 0,
    avgCtr: 0,
    avgPosition: 0,
    totalUser: 0,
    organicUser: 0,
    directUser: 0,
    referralUser: 0,
    totalInquiry: 0,
    inquiryDownload: 0,
    inquiryWhatsapp: 0,
    register: 0,
    join: 0,
    firstDeposit: 0,
    totalDeposit: 0,
  };

  Object.values(filteredDataByProject).forEach(projectData => {
    projectData.forEach(row => {
      totals.totalClicks += row.clicks || 0;
      totals.totalImpressions += row.impressions || 0;
      totals.totalUser += row.total_user || 0;
      totals.organicUser += row.organic_search || 0;
      totals.directUser += row.direct || 0;
      totals.referralUser += row.referral || 0;
      totals.inquiryDownload += row.inquiry_download || 0;
      totals.inquiryWhatsapp += row.inquiry_whatsapp || 0;
      totals.register += row.register || 0;
      totals.join += row.join || 0;
      totals.firstDeposit += row.first_deposit || 0;
      totals.totalDeposit += row.total_deposit || 0;
    });
  });

  const totalRows = Object.values(filteredDataByProject).reduce((sum, d) => sum + d.length, 0);
  totals.avgCtr = totalRows > 0 ? (totals.totalClicks / totals.totalImpressions * 100).toFixed(2) : 0;
  totals.avgPosition = totalRows > 0 ? (Object.values(filteredDataByProject).flat().reduce((sum, r) => sum + (r.position || 0), 0) / totalRows).toFixed(1) : 0;

  // Quick filter buttons (update date range)
  const handleQuickFilter = (days) => {
    const to = new Date();
    const from = subDays(to, days);
    setDateRange({ from, to });
  };

  // Project multi-select toggle
  const toggleProject = (projectId) => {
    setSelectedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(p => p !== projectId)
        : [...prev, projectId]
    );
  };

  if (!overview?.projects?.length) {
    return <div className="text-center py-12 text-muted-foreground">No performance data available</div>;
  }

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        {/* Quick buttons with active state */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "transition-colors",
              dateRange.from && dateRange.to && 
              Math.round((new Date() - dateRange.from) / (1000 * 60 * 60 * 24)) === 1
                ? "bg-primary text-primary-foreground hover:bg-primary/90 border-primary shadow-sm"
                : ""
            )}
            onClick={() => handleQuickFilter(1)}
          >
            24 Hours
          </Button>

          <Button
            variant="outline"
            size="sm"
            className={cn(
              "transition-colors",
              dateRange.from && dateRange.to && 
              Math.round((new Date() - dateRange.from) / (1000 * 60 * 60 * 24)) === 7
                ? "bg-primary text-primary-foreground hover:bg-primary/90 border-primary shadow-sm"
                : ""
            )}
            onClick={() => handleQuickFilter(7)}
          >
            7 Days
          </Button>

          <Button
            variant="outline"
            size="sm"
            className={cn(
              "transition-colors",
              dateRange.from && dateRange.to && 
              Math.round((new Date() - dateRange.from) / (1000 * 60 * 60 * 24)) === 28
                ? "bg-primary text-primary-foreground hover:bg-primary/90 border-primary shadow-sm"
                : ""
            )}
            onClick={() => handleQuickFilter(28)}
          >
            28 Days
          </Button>

          <Button
            variant="outline"
            size="sm"
            className={cn(
              "transition-colors",
              dateRange.from && dateRange.to && 
              Math.round((new Date() - dateRange.from) / (1000 * 60 * 60 * 24)) === 90
                ? "bg-primary text-primary-foreground hover:bg-primary/90 border-primary shadow-sm"
                : ""
            )}
            onClick={() => handleQuickFilter(90)}
          >
            3 Months
          </Button>
        </div>

        {/* Date Range & Project Select */}
        <div className="flex gap-4 items-center">
          <div className="w-[360px]">
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

          <div className="w-[300px]">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-between">
                  {selectedProjects.length > 0
                    ? `${selectedProjects.length} project${selectedProjects.length > 1 ? "s" : ""} selected`
                    : "Compare Project"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Search project..." />
                  <CommandList>
                    <CommandEmpty>No project found.</CommandEmpty>
                    <CommandGroup>
                      {overview.projects.map((p) => (
                        <CommandItem
                          key={p.project_id}
                          value={p.project_id}
                          onSelect={() => toggleProject(p.project_id)}
                        >
                          <Check className={cn("mr-2 h-4 w-4", selectedProjects.includes(p.project_id) ? "opacity-100" : "opacity-0")} />
                          {p.project_name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="w-auto">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Per Day" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="day">Per Day</SelectItem>
                <SelectItem value="week">Per Week</SelectItem>
                <SelectItem value="month">Per Month</SelectItem>
                <SelectItem value="year">Per Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <div className="border border-[#E5E6E6] p-4 rounded-lg text-center">
          <p className="text-2xl font-bold">{totals.totalClicks.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Total Clicks</p>
        </div>
        <div className="border border-[#E5E6E6] p-4 rounded-lg text-center">
          <p className="text-2xl font-bold">{totals.totalImpressions.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Total Impressions</p>
        </div>
        <div className="border border-[#E5E6E6] p-4 rounded-lg text-center">
          <p className="text-2xl font-bold">{totals.avgCtr}%</p>
          <p className="text-sm text-muted-foreground">Average CTR</p>
        </div>
        <div className="border border-[#E5E6E6] p-4 rounded-lg text-center">
          <p className="text-2xl font-bold">{totals.avgPosition}</p>
          <p className="text-sm text-muted-foreground">Average Position</p>
        </div>
        <div className="border border-[#E5E6E6] p-4 rounded-lg text-center">
          <p className="text-2xl font-bold">{totals.totalUser.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Total User</p>
        </div>
        <div className="border border-[#E5E6E6] p-4 rounded-lg text-center">
          <p className="text-2xl font-bold">{totals.organicUser.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Organic User</p>
        </div>
        <div className="border border-[#E5E6E6] p-4 rounded-lg text-center">
          <p className="text-2xl font-bold">{totals.directUser.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Direct User</p>
        </div>
        <div className="border border-[#E5E6E6] p-4 rounded-lg text-center">
          <p className="text-2xl font-bold">{totals.referralUser.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Referral User</p>
        </div>
      </div>

      {/* Charts + Right Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {selectedProjects.map(projectId => {
            const project = overview.projects.find(p => p.project_id === projectId);
            if (!project) return null;

            const projectName = project.project_name || project.project_id;
            const projectData = filteredDataByProject[projectName] || [];

            // Project-specific chart data
            const projectChartData = projectData.map(row => ({
              date: row.period,
              analytics: row.total_user || 0,
              searchConsole: row.clicks || 0,
              conversion: row.join || 0,
            })).sort((a, b) => new Date(a.date) - new Date(b.date));

            return (   
              <>          
                <div className="lg:col-span-10 space-y-8">
                  <div key={projectId} className="border rounded-lg p-6 bg-card">
                    <h3 className="text-lg font-semibold mb-4">{projectName} Performance</h3>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={projectChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => format(new Date(date), "dd MMM")} 
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip
                          formatter={(value) => value.toLocaleString()}
                          labelFormatter={(date) => format(new Date(date), "EEEE, MMM dd")}
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e5e7eb', 
                            borderRadius: '8px', 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                          }}
                        />
                        <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingBottom: '10px' }} />
                        <Line type="monotone" dataKey="analytics" stroke="#3872FA" strokeWidth={2} dot={false} name="Analytics (Total User)" />
                        <Line type="monotone" dataKey="searchConsole" stroke="#0EB170" strokeWidth={2} dot={false} name="Search Console (Clicks)" />
                        <Line type="monotone" dataKey="conversion" stroke="#B94DF3" strokeWidth={2} dot={false} name="Conversion (Join)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div> 
                </div>
                <div className="lg:col-span-2 border rounded-lg p-6 flex flex-col justify-between bg-muted/50">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-base font-semibold">Inquiry</h4>
                      <p className="text-2xl font-bold">{totals.totalInquiry.toLocaleString()}</p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Download</span>
                        <span>{totals.inquiryDownload.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">WhatsApp</span>
                        <span>{totals.inquiryWhatsapp.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-base font-semibold mb-4">Conversion</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Register</span>
                        <span>{totals.register.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Join</span>
                        <span>{totals.join.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">First Deposit</span>
                        <span>RM {totals.firstDeposit.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Total Deposit</span>
                        <span>RM {totals.totalDeposit.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>        
            );
          })}        
      </div>
    </div>
  );
};

export default PerformanceOverview;