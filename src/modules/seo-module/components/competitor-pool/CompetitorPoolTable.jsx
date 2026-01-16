import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// import { format } from "date-fns";

const CompetitorPoolTable = ({ competitors }) => {
  return (
    <ScrollArea className="rounded-md border h-[calc(100vh-220px)]">
      <Table>
        <TableHeader className="sticky top-0 bg-white z-10">
          <TableRow>
            <TableHead className="w-[50px]">No</TableHead>
            <TableHead>Unique Domain</TableHead>
            <TableHead>Live Link</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Price (USD)</TableHead>
            <TableHead>Overlap Competitors</TableHead>
            <TableHead>Associated Vendors</TableHead>
            <TableHead>Project Consists Link</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {competitors.length > 0 ? (
            competitors.map((comp, index) => (
              <TableRow key={comp.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium">
                  {comp.unique_domain || "-"}
                </TableCell>
                <TableCell>
                  {comp.live_link ? (
                    <a
                      href={`https://${comp.unique_domain}${
                        comp.live_link.startsWith("/") ? "" : "/"
                      }${comp.live_link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Live Link
                    </a>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>{comp.vendor || "-"}</TableCell>
                <TableCell className="text-right font-medium">
                  {comp.price_usd ? `$${comp.price_usd}` : "-"}
                </TableCell>
                <TableCell>{comp.overlap_competitors || "-"}</TableCell>
                <TableCell>{comp.associated_vendors || "-"}</TableCell>
                <TableCell>{comp.project_consists_link || "-"}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={8}
                className="h-24 text-center text-muted-foreground"
              >
                No competitors found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default CompetitorPoolTable;
