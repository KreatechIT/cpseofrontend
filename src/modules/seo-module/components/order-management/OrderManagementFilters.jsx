import { Button } from "@/components/ui/button";
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
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import OrderManagementTableView from "./OrderManagementTableView";


const OrderManagementFilters = ({ orders }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedLinkType, setSelectedLinkType] = useState(null);
  const [selectedOrderMonth, setSelectedOrderMonth] = useState(null);

  // Unique options
  const vendorOptions = useMemo(
    () => [...new Set(orders.map((o) => o.vendor).filter(Boolean))],
    [orders]
  );
  const projectOptions = useMemo(
    () => [...new Set(orders.map((o) => o.project).filter(Boolean))],
    [orders]
  );
  const domainOptions = useMemo(
    () => [...new Set(orders.map((o) => o.domain).filter(Boolean))],
    [orders]
  );
  const linkTypeOptions = useMemo(
    () => [...new Set(orders.map((o) => o.link_type).filter(Boolean))],
    [orders]
  );
  const orderMonthOptions = useMemo(
    () => [...new Set(orders.map((o) => o.order_month).filter(Boolean))],
    [orders]
  );

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (
        searchQuery &&
        !Object.values(order).some((v) =>
          v?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
        return false;

      if (selectedVendor && order.vendor !== selectedVendor) return false;
      if (selectedProject && order.project !== selectedProject) return false;
      if (selectedDomain && order.domain !== selectedDomain) return false;
      if (selectedLinkType && order.link_type !== selectedLinkType)
        return false;
      if (selectedOrderMonth && order.order_month !== selectedOrderMonth)
        return false;

      return true;
    });
  }, [
    orders,
    searchQuery,
    selectedVendor,
    selectedProject,
    selectedDomain,
    selectedLinkType,
    selectedOrderMonth,
  ]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end mt-3">
        {/* <div className="flex-1 min-w-[300px]">
          <Label className="mb-3">Search</Label>
          <Input
            placeholder="Search any field..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div> */}

        <div>
          <Label className="mb-3">Vendor</Label>
          <Select
            value={selectedVendor ?? ""}
            onValueChange={(v) => setSelectedVendor(v || null)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Vendors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>All Vendors</SelectItem>
              {vendorOptions.map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-3">Order Month</Label>
          <Select
            value={selectedOrderMonth ?? ""}
            onValueChange={(v) => setSelectedOrderMonth(v || null)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Months" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>All Months</SelectItem>
              {orderMonthOptions.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-3">Project</Label>
          <Select
            value={selectedProject ?? ""}
            onValueChange={(v) => setSelectedProject(v || null)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>All Projects</SelectItem>
              {projectOptions.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-3">Domain</Label>
          <Select
            value={selectedDomain ?? ""}
            onValueChange={(v) => setSelectedDomain(v || null)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Domains" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>All Domains</SelectItem>
              {domainOptions.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-3">Link Type</Label>
          <Select
            value={selectedLinkType ?? ""}
            onValueChange={(v) => setSelectedLinkType(v || null)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Link Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>All Link Types</SelectItem>
              {linkTypeOptions.map((lt) => (
                <SelectItem key={lt} value={lt}>
                  {lt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <OrderManagementTableView filteredOrders={filteredOrders} />
    </div>
  );
};

export default OrderManagementFilters;
