import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// Dummy data
const dummyData = [
  {
    uniqueDomain: "exlinko.net",
    liveLink: "https://exlinko.net/b/ztkll-rank-website-in-3-weeks/",
    account: "Vendor Alpha",
    domainRating: "51.00",
    urlRating: "35",
    domainTraffic: "12000",
    referringDomains: "695",
    linkedDomains: "3627",
    status: "Found",
    externalLinks: "4292",
    pageTraffic: "0",
    totalOrganicKeywords: "0",
    targetURL: "https://myhealthworks.com.my/",
    anchorText: "Hate Slow SEO climbs, myhealthworks.com.my? | ExLinko.com fixed it.",
    redirectChainURLs: "",
    redirectChainStatusCodes: "",
    follow: "No",
    firstSeen: "22/07/2025",
    lastSeen: "26/07/2025",
    lost: "No",
  },
  {
    uniqueDomain: "seoflx.net",
    liveLink: "https://seoflx.net/b/gmrxq-rank-website-on-first-page/",
    account: "Vendor Bravo",
    domainRating: "51.00",
    urlRating: "31",
    domainTraffic: "8500",
    referringDomains: "335",
    linkedDomains: "7257",
    status: "Found",
    externalLinks: "8581",
    pageTraffic: "0",
    totalOrganicKeywords: "0",
    targetURL: "https://myhealthworks.com.my/",
    anchorText: "We uncovered a ranking trick hiding in plain sight for myhealthworks.com.my on SeoFlox.com.",
    redirectChainURLs: "",
    redirectChainStatusCodes: "",
    follow: "No",
    firstSeen: "27/01/2025",
    lastSeen: "26/07/2025",
    lost: "No",
  },
  {
    uniqueDomain: "backlinksite.com",
    liveLink: "https://backlinksite.com/article/seo-tips",
    account: "Vendor Charlie",
    domainRating: "45.00",
    urlRating: "28",
    domainTraffic: "5000",
    referringDomains: "420",
    linkedDomains: "1800",
    status: "Lost",
    externalLinks: "2100",
    pageTraffic: "150",
    totalOrganicKeywords: "120",
    targetURL: "https://myhealthworks.com.my/services/",
    anchorText: "best physiotherapy in KL",
    redirectChainURLs: "https://old.com → https://new.com",
    redirectChainStatusCodes: "301 → 200",
    follow: "Yes",
    firstSeen: "10/06/2025",
    lastSeen: "15/12/2025",
    lost: "Yes",
  },
  {
    uniqueDomain: "healthblog.my",
    liveLink: "https://healthblog.my/chiropractic-benefits",
    account: "Vendor Delta",
    domainRating: "38.00",
    urlRating: "25",
    domainTraffic: "3200",
    referringDomains: "280",
    linkedDomains: "950",
    status: "Found",
    externalLinks: "1200",
    pageTraffic: "80",
    totalOrganicKeywords: "45",
    targetURL: "https://myhealthworks.com.my/chiropractic-treatment-kl-for-lasting-relief/",
    anchorText: "chiropractic alignment KL",
    redirectChainURLs: "",
    redirectChainStatusCodes: "",
    follow: "Yes",
    firstSeen: "05/11/2025",
    lastSeen: "28/12/2025",
    lost: "No",
  },
];

// Mock project options
const projects = ["HealthWorks KL", "Core Project", "New Campaign 2025"];

const AhrefsReport = () => {
  const [selectedProject, setSelectedProject] = useState("");

  return (
    <div className="space-y-8 mt-6">
      {/* Header with Project Select on Right */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Project Data</h2>
        <div className="w-[300px]">
          <Label className="mb-3">Project</Label>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-card">
        <ScrollArea className="h-[700px]">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-[50px]">No</TableHead>
                <TableHead>Unique Domain</TableHead>
                <TableHead>Live Link</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Domain Rating</TableHead>
                <TableHead>URL Rating</TableHead>
                <TableHead>Domain Traffic</TableHead>
                <TableHead>Referring Domains</TableHead>
                <TableHead>Linked Domains</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>External Links</TableHead>
                <TableHead>Page Traffic</TableHead>
                <TableHead>Total Organic Keywords</TableHead>
                <TableHead>Target URL</TableHead>
                <TableHead>Anchor Text</TableHead>
                <TableHead>Redirect Chain URLs</TableHead>
                <TableHead>Redirect Chain Status Codes</TableHead>
                <TableHead>Follow</TableHead>
                <TableHead>First Seen</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead>Lost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{row.uniqueDomain}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    <a href={row.liveLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {row.liveLink}
                    </a>
                  </TableCell>
                  <TableCell>{row.account}</TableCell>
                  <TableCell>{row.domainRating}</TableCell>
                  <TableCell>{row.urlRating}</TableCell>
                  <TableCell>{row.domainTraffic}</TableCell>
                  <TableCell>{row.referringDomains}</TableCell>
                  <TableCell>{row.linkedDomains}</TableCell>
                  <TableCell>
                    <span className={row.status === "Found" ? "text-green-600" : "text-red-600"}>
                      {row.status}
                    </span>
                  </TableCell>
                  <TableCell>{row.externalLinks}</TableCell>
                  <TableCell>{row.pageTraffic}</TableCell>
                  <TableCell>{row.totalOrganicKeywords}</TableCell>
                  <TableCell>{row.targetURL}</TableCell>
                  <TableCell>{row.anchorText}</TableCell>
                  <TableCell>{row.redirectChainURLs || "-"}</TableCell>
                  <TableCell>{row.redirectChainStatusCodes || "-"}</TableCell>
                  <TableCell>{row.follow}</TableCell>
                  <TableCell>{row.firstSeen}</TableCell>
                  <TableCell>{row.lastSeen}</TableCell>
                  <TableCell>
                    <span className={row.lost === "No" ? "text-green-600" : "text-red-600"}>
                      {row.lost}
                    </span>
                  </TableCell>
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

export default AhrefsReport;