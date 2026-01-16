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

const LinkSimilarity = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(null);

  // Unique vendors for dropdown
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get("/seo/link-similarity/");
        setData(res.data.data || []);

        // Extract unique vendors for dropdown
        const uniqueVendors = [
          ...new Set(res.data.data.map((item) => item.vendor_name)),
        ];
        setVendors(uniqueVendors);

        // Default to no vendor (all)
        setSelectedVendor(null);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load Link Similarity data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtered data (search on vendor name, filter on selected vendor)
  const filteredData = data.filter((row) => {
    const matchesSearch = searchQuery
      ? row.vendor_name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesVendor = selectedVendor
      ? row.vendor_name === selectedVendor
      : true;
    return matchesSearch && matchesVendor;
  });

  if (loading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Loading Link Similarity...
      </div>
    );
  }

  if (error || !data.length) {
    return (
      <div className="text-center py-12 text-red-600">
        No data available or error loading.
      </div>
    );
  }

  return (
    <div className="space-y-8 mt-6">
      {/* Filters */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Label className="mb-3">Search</Label>
          <Input
            placeholder="Search vendor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
        </div>

        <div className="w-[200px]">
          <Label className="mb-3">Vendor Select</Label>
          <Select
            value={selectedVendor ?? "all"}
            onValueChange={(v) => setSelectedVendor(v === "all" ? null : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Vendors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vendors</SelectItem>
              {vendors.map((vendor) => (
                <SelectItem key={vendor} value={vendor}>
                  {vendor}
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
                <TableHead>Vendor</TableHead>
                <TableHead>Total Clicks</TableHead>
                {/* <TableHead>Note</TableHead> */}
                <TableHead>Similarity Percentage (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {row.vendor_name}
                  </TableCell>
                  <TableCell>{row.total_links}</TableCell>
                  {/* <TableCell>{row.matched_domains.join(", ") || "-"}</TableCell> */}
                  <TableCell>{row.similarity_percentage.toFixed(2)}%</TableCell>
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

export default LinkSimilarity;
