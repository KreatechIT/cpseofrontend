import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

const InsightTable = ({ data, onOpenVendorSummary }) => {
  if (!data || data.length === 0) {
    return <p className="text-center py-8 text-muted-foreground">No data available</p>;
  }

  return (
    <ScrollArea className="rounded-md border h-[600px]">
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            <TableHead className="w-[50px]">No</TableHead>
            <TableHead>Unique Domain</TableHead>
            <TableHead>Live Link</TableHead>
            <TableHead>Domain Rating</TableHead>
            <TableHead>URL Rating</TableHead>
            <TableHead>Note</TableHead>
            <TableHead>Domain Authority</TableHead>
            <TableHead>Page Authority</TableHead>
            <TableHead>Spam Score</TableHead>
            <TableHead>Target URL</TableHead>
            <TableHead>Anchor Text</TableHead>
            <TableHead>Domain Traffic</TableHead>
            <TableHead>Referring Domains</TableHead>
            <TableHead>Linked Domains</TableHead>
            <TableHead>External Links</TableHead>
            <TableHead>Page Traffic</TableHead>
            <TableHead>Total Organic Keyword</TableHead>
            <TableHead>Redirect Chain URLs</TableHead>
            <TableHead>Follow</TableHead>
            <TableHead>First Seen</TableHead>
            <TableHead>Last Seen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={row.id || index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{row.unique_domain || "-"}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                {row.live_link ? (
                  <a href={row.live_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {row.live_link}
                  </a>
                ) : "-"}
              </TableCell>
              <TableCell>{row.domain_rating || "-"}</TableCell>
              <TableCell>{row.url_rating || row.page_authority || "-"}</TableCell>
              <TableCell>{row.remark || row.note || "-"}</TableCell>
              <TableCell>{row.domain_authority || "-"}</TableCell>
              <TableCell>{row.page_authority || "-"}</TableCell>
              <TableCell>{row.spam_score || "-"}</TableCell>
              <TableCell>{row.target_url_1 || row.target_url || "-"}</TableCell>
              <TableCell>{row.keyword_1 || row.anchor || row.anchor_text || "-"}</TableCell>
              <TableCell>{row.traffic || row.domain_traffic || "-"}</TableCell>
              <TableCell>{row.referring_domains || "-"}</TableCell>
              <TableCell>{row.linked_domains || "-"}</TableCell>
              <TableCell>{row.external_links || "-"}</TableCell>
              <TableCell>{row.page_traffic || "-"}</TableCell>
              <TableCell>{row.total_organic_keywords || "-"}</TableCell>
              <TableCell>{row.redirect_chain_urls || "-"}</TableCell>
              <TableCell>{row.follow || "-"}</TableCell>
              <TableCell>{row.first_seen || "-"}</TableCell>
              <TableCell>{row.last_seen || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default InsightTable;