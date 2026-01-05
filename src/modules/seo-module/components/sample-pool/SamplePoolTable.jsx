import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { BackgroundColor } from "@tiptap/extension-text-style";

const SamplePoolTable = ({ samples }) => {
  return (
    <ScrollArea className="rounded-md border h-[calc(100vh-200px)]">
      <Table>
        <TableHeader className="sticky top-0 z-10" style={{background: "#3872FA33"}}>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Discovered Date</TableHead>
            <TableHead>Discovered By</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Unique Domain</TableHead>
            <TableHead>Link Type</TableHead>
            <TableHead>Price (USD) General</TableHead>
            <TableHead>Price (USD) Niche</TableHead>
            <TableHead>Domain Rating</TableHead>
            <TableHead>Traffic</TableHead>
            <TableHead>Domain Authority</TableHead>
            <TableHead>Page Authority</TableHead>
            <TableHead>Spam Score</TableHead>
            <TableHead>Domain Created Date</TableHead>
            <TableHead>Domain Expiration Date</TableHead>
            <TableHead>Domain Age</TableHead>
            <TableHead>Overlap Competitors</TableHead>
            <TableHead>Project Consists Link</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Lowest Price (USD) General</TableHead>
            <TableHead>Lowest Price (USD) Niche</TableHead>
            <TableHead>Lowest Price Date (Discovered)</TableHead>
            <TableHead>Remark</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {samples.length > 0 ? (
            samples.map((sample, index) => (
              <TableRow key={sample.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{sample.discovered_date ? format(new Date(sample.discovered_date), "dd MMM yyyy") : "-"}</TableCell>
                <TableCell>{sample.discovered_by || "-"}</TableCell>
                <TableCell>{sample.vendor || "-"}</TableCell>
                <TableCell>{sample.category || "-"}</TableCell>
                <TableCell>{sample.unique_domain || "-"}</TableCell>
                <TableCell>{sample.link_type || "-"}</TableCell>
                <TableCell>{sample.price_usd_general || "-"}</TableCell>
                <TableCell>{sample.price_usd_niche || "-"}</TableCell>
                <TableCell>{sample.domain_rating || "-"}</TableCell>
                <TableCell>{sample.traffic || "-"}</TableCell>
                <TableCell>{sample.domain_authority || "-"}</TableCell>
                <TableCell>{sample.page_authority || "-"}</TableCell>
                <TableCell>{sample.spam_score || "-"}</TableCell>
                <TableCell>{sample.domain_created_date ? format(new Date(sample.domain_created_date), "dd MMM yyyy") : "-"}</TableCell>
                <TableCell>{sample.domain_expiration_date ? format(new Date(sample.domain_expiration_date), "dd MMM yyyy") : "-"}</TableCell>
                <TableCell>{sample.domain_age || "-"}</TableCell>
                <TableCell>{sample.overlap_competitors || "-"}</TableCell>
                <TableCell>{sample.project_consists_link || "-"}</TableCell>
                <TableCell>{sample.vendor || "-"}</TableCell>
                <TableCell>{sample.lowest_price_usd_general || "-"}</TableCell>
                <TableCell>{sample.lowest_price_usd_niche || "-"}</TableCell>
                <TableCell>{sample.lowest_price_date ? format(new Date(sample.lowest_price_date), "dd MMM yyyy") : "-"}</TableCell>
                {/* <TableCell className="max-w-xs truncate">{sample.remark || "-"}</TableCell> */}
                <TableCell className="max-w-xs truncate">  </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={24} className="h-24 text-center text-muted-foreground">
                No samples found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default SamplePoolTable;