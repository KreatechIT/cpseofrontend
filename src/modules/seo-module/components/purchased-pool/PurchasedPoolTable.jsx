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

const PurchasedPoolTable = ({ purchased }) => {
  return (
    <ScrollArea className="rounded-md border h-[calc(100vh-220px)]">
      <Table>
        <TableHeader className="sticky top-0 z-10" style={{background: "#3872FA33"}}>
          <TableRow>
            <TableHead className="w-[50px]">No.</TableHead>
            <TableHead>Project ID</TableHead>
            <TableHead>Backlinks ID</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead>Order Month</TableHead>
            <TableHead>Domain</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Link Type</TableHead>
            <TableHead>Price Per Link (USD)</TableHead>
            <TableHead>Price Per Link (MYR)</TableHead>
            <TableHead>Unique Domain</TableHead>
            <TableHead>Live Link</TableHead>
            <TableHead>Latest Live Link Index</TableHead>
            <TableHead>Unique Domain Index</TableHead>
            <TableHead>Keyword (1)</TableHead>
            <TableHead>Target URL (1)</TableHead>
            <TableHead>Keyword (2)</TableHead>
            <TableHead>Target URL (2)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Link Status</TableHead>
            <TableHead>Follow</TableHead>
            <TableHead>Domain Rating</TableHead>
            <TableHead>Domain Authority</TableHead>
            <TableHead>Page Authority</TableHead>
            <TableHead>Spam Score</TableHead>
            <TableHead>Domain Created Date</TableHead>
            <TableHead>Domain Expiration Date</TableHead>
            <TableHead>Domain Age</TableHead>
            <TableHead>Remark</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchased.length > 0 ? (
            purchased.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{item.project || "-"}</TableCell>
                <TableCell className="font-medium">
                  {item.backlinks_id || "-"}
                </TableCell>
                <TableCell>
                  {item.created
                    ? format(new Date(item.created), "dd MMM yyyy")
                    : "-"}
                </TableCell>
                <TableCell>{item.order_month || "-"}</TableCell>
                <TableCell>{item.domain || "-"}</TableCell>
                <TableCell>{item.vendor || "-"}</TableCell>
                <TableCell>{item.link_type || "-"}</TableCell>
                <TableCell className="text-right">
                  {item.price_usd || "-"}
                </TableCell>
                <TableCell className="text-right">
                  {item.price_myr || "-"}
                </TableCell>
                <TableCell>{item.unique_domain || "-"}</TableCell>
                <TableCell>
                  {item.live_link ? (
                    <a
                      href={item.live_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </a>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>{item.latest_live_link_index || "-"}</TableCell>
                <TableCell>{item.unique_domain_index || "-"}</TableCell>
                <TableCell>{item.keyword_1 || "-"}</TableCell>
                <TableCell>
                  {item.target_url_1 ? (
                    <a
                      href={item.target_url_1}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate block max-w-xs"
                    >
                      {item.target_url_1}
                    </a>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>{item.keyword_2 || "-"}</TableCell>
                <TableCell>
                  {item.target_url_2 ? (
                    <a
                      href={item.target_url_2}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate block max-w-xs"
                    >
                      {item.target_url_2}
                    </a>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>{item.status || "-"}</TableCell>
                <TableCell>{item.link_status || "-"}</TableCell>
                <TableCell>{item.follow || "-"}</TableCell>
                <TableCell>{item.domain_rating || "-"}</TableCell>
                <TableCell>{item.domain_authority || "-"}</TableCell>
                <TableCell>{item.page_authority || "-"}</TableCell>
                <TableCell>{item.spam_score || "-"}</TableCell>
                <TableCell>
                  {item.domain_created_date
                    ? format(new Date(item.domain_created_date), "dd MMM yyyy")
                    : "-"}
                </TableCell>
                <TableCell>
                  {item.domain_expiration_date
                    ? format(
                        new Date(item.domain_expiration_date),
                        "dd MMM yyyy"
                      )
                    : "-"}
                </TableCell>
                <TableCell>{item.domain_age || "-"}</TableCell>
                {/* <TableCell className="max-w-xs truncate">
                  {item.remark || "-"}
                </TableCell> */}
                <TableCell className="max-w-xs truncate">
                  
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={29}
                className="h-24 text-center text-muted-foreground"
              >
                No purchased links found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default PurchasedPoolTable;
