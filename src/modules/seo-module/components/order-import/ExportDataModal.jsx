import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog_full_width";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Download, X } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

const ExportDataModal = ({ open, onClose, orders }) => {
  const handleExportToExcel = () => {
    if (!orders || orders.length === 0) {
      toast.error("No data to export");
      return;
    }

    try {
      // Prepare data for Excel
      const excelData = orders.map((order) => ({
        "No": order.no || "",
        "Referring Domain": order.referring_domain || "",
        "Live Link": order.live_link || "",
        "Publish Date": order.publish_date || "",
        "Keyword 1": order.keyword_1 || "",
        "Target URL 1": order.target_url_1 || "",
        "Keyword 2": order.keyword_2 || "",
        "Target URL 2": order.target_url_2 || "",
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      ws['!cols'] = [
        { wch: 5 },  // No
        { wch: 25 }, // Referring Domain
        { wch: 30 }, // Live Link
        { wch: 15 }, // Publish Date
        { wch: 20 }, // Keyword 1
        { wch: 40 }, // Target URL 1
        { wch: 20 }, // Keyword 2
        { wch: 40 }, // Target URL 2
      ];

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Imported Links");

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `Order_Import_Links_${timestamp}.xlsx`;

      // Download file
      XLSX.writeFile(wb, filename);
      toast.success(`Exported ${orders.length} links to ${filename}`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">Import Successful!</DialogTitle>
              <DialogDescription className="mt-2">
                Successfully imported {orders?.length || 0} link{orders?.length !== 1 ? 's' : ''}
              </DialogDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[500px] rounded-md border">
            <Table>
              <TableHeader className="sticky top-0 bg-white z-10">
                <TableRow>
                  <TableHead className="w-[60px]">No</TableHead>
                  <TableHead>Referring Domain</TableHead>
                  <TableHead>Live Link</TableHead>
                  <TableHead>Publish Date</TableHead>
                  <TableHead>Keyword 1</TableHead>
                  <TableHead>Target URL 1</TableHead>
                  <TableHead>Keyword 2</TableHead>
                  <TableHead>Target URL 2</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders && orders.length > 0 ? (
                  orders.map((order, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{order.no || "-"}</TableCell>
                      <TableCell className="max-w-[200px] whitespace-normal break-words">{order.referring_domain || "-"}</TableCell>
                      <TableCell className="max-w-[200px] whitespace-normal break-words">{order.live_link || "-"}</TableCell>
                      <TableCell>{order.publish_date || "-"}</TableCell>
                      <TableCell className="max-w-[150px] whitespace-normal break-words">{order.keyword_1 || "-"}</TableCell>
                      <TableCell className="max-w-[200px] whitespace-normal break-words">{order.target_url_1 || "-"}</TableCell>
                      <TableCell className="max-w-[150px] whitespace-normal break-words">{order.keyword_2 || "-"}</TableCell>
                      <TableCell className="max-w-[200px] whitespace-normal break-words">{order.target_url_2 || "-"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleExportToExcel} className="bg-green-600 hover:bg-green-700">
            <Download className="mr-2 h-4 w-4" />
            Export to Excel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDataModal;
