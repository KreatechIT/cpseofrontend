import { useState } from "react";
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
import { Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import DeleteCompetitorConfirmation from "./DeleteCompetitorConfirmation";

// Safe date formatting helper
const safeFormat = (dateStr, formatStr = "dd MMM yyyy") => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? "-" : format(date, formatStr);
};

const CompetitorDetailsTable = ({ filteredCompetitors }) => {
  const navigate = useNavigate();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);

  const handleEdit = (comp) => {
    navigate(`/seo/competitor-details/edit/${comp.id}`);
  };

  const handleDeleteClick = (comp) => {
    setSelectedCompetitor(comp);
    setDeleteOpen(true);
  };

  const [expandedCard, setExpandedCard] = useState(null);

  // Sample data for Mind Map (replace with real API data later)
  const mindMapData = [
    {
      id: 1,
      order: "Order #001",
      domain: "cchit.org",
      start: "15-21 May 2023",
      stop: "12 Aug 2023",
      duration: "21 days",
    },
    {
      id: 2,
      order: "Order #002",
      domain: "example.com",
      start: "1 Jun 2023",
      stop: "30 Jun 2023",
      duration: "30 days",
    },
  ];

  const subTierData = {
    1: [
      {
        tier: "3.1 (Tier 2)",
        domain: "bruxy.org",
        start: "8 October 2022",
        stop: "N/A",
      },
      {
        tier: "3.2 (Tier 2)",
        domain: "healthsite.net",
        start: "10 Nov 2022",
        stop: "N/A",
      },
    ],
  };

  const toggleCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <>
      <div className="space-y-8">
        <ScrollArea className="rounded-md border">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                <TableHead className="w-[50px]">No</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Unique Domain</TableHead>
                <TableHead>Redirection</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Business Type</TableHead>
                <TableHead>Domain Rating</TableHead>
                <TableHead>URL Rating</TableHead>
                <TableHead>Domain Authority</TableHead>
                <TableHead>Page Authority</TableHead>
                <TableHead>Spam Score</TableHead>
                <TableHead>No. of Backlinks</TableHead>
                <TableHead>Referring Domain</TableHead>
                <TableHead>No. of Keywords</TableHead>
                <TableHead>Domain Created Date</TableHead>
                <TableHead>Domain Expiration Date</TableHead>
                <TableHead>Domain Age</TableHead>
                <TableHead>Date Start Ranking</TableHead>
                {/* <TableHead className="w-[120px]">Actions</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompetitors?.length > 0 ? (
                filteredCompetitors.map((comp, index) => (
                  <TableRow key={comp.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {comp.company || "-"}
                    </TableCell>
                    <TableCell>{comp.unique_domain || "-"}</TableCell>
                    <TableCell>{comp.redirection || "-"}</TableCell>
                    <TableCell>{comp.product?.join(", ") || "-"}</TableCell>
                    <TableCell>
                      {comp.business_type?.join(", ") || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {comp.domain_rating || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {comp.url_rating || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {comp.domain_authority || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {comp.page_authority || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {comp.spam_score || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {comp.total_backlinks || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {comp.referring_domain || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {comp.total_organic_keywords || "-"}
                    </TableCell>
                    <TableCell>
                      {safeFormat(comp.domain_created_date)}
                    </TableCell>
                    <TableCell>
                      {safeFormat(comp.domain_expiration_date)}
                    </TableCell>
                    <TableCell>{comp.domain_age || "-"}</TableCell>
                    <TableCell>{safeFormat(comp.date_start_ranking)}</TableCell>
                    {/* <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(comp)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(comp)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell> */}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={19}
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

        {/* Delete Modal */}
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent className="sm:max-w-md">
            {selectedCompetitor && (
              <DeleteCompetitorConfirmation
                competitor={selectedCompetitor}
                onClose={() => setDeleteOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Mind Map Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="default"
              className="bg-[#3872FA] hover:bg-[#3872FA]/90"
            >
              Mind Map
            </Button>
            <Button variant="outline">Last 30 days</Button>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Left Side - Scrollable List */}
            <div className="col-span-3">
              <ScrollArea className="h-[500px] rounded-md border">
                <div className="p-4 space-y-3">
                  {mindMapData.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                      onClick={() => toggleCard(item.id)}
                    >
                      <p className="font-medium">{item.order}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.domain}
                      </p>
                      <p className="text-sm">{item.start}</p>
                      <p className="text-sm">{item.stop}</p>
                      <p className="text-sm font-medium">{item.duration}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Right Side - Flow Chart Cards */}
            <div className="col-span-9 relative">
              <div className="space-y-8">
                {mindMapData.map((item, index) => (
                  <div key={item.id} className="relative">
                    {/* Main Card */}
                    <div
                      className="border-2 border-[#3872FA] rounded-xl p-6 text-center cursor-pointer hover:shadow-lg transition"
                      onClick={() => toggleCard(item.id)}
                    >
                      <div className="text-4xl font-bold text-[#3872FA] mb-2">
                        {index + 1}
                      </div>
                      <div className="text-lg font-medium">{item.domain}</div>
                      <div className="text-sm text-muted-foreground mt-2">
                        {item.start} → {item.stop}
                      </div>
                      <div className="mt-3">
                        {expandedCard === item.id ? (
                          <ChevronUp className="h-5 w-5 mx-auto text-[#3872FA]" />
                        ) : (
                          <ChevronDown className="h-5 w-5 mx-auto text-[#3872FA]" />
                        )}
                      </div>
                    </div>

                    {/* Connecting Line */}
                    {index < mindMapData.length - 1 && (
                      <div className="absolute left-1/2 top-full w-0.5 h-16 bg-[#3872FA] -translate-x-1/2" />
                    )}

                    {/* Expanded Sub-Tier Cards */}
                    {expandedCard === item.id && subTierData[item.id] && (
                      <div className="mt-8 ml-12 space-y-6">
                        {subTierData[item.id].map((sub, subIndex) => (
                          <div key={subIndex} className="relative">
                            <div className="border-2 border-[#3872FA] rounded-xl p-5 text-center bg-[#3872FA]/5">
                              <div className="text-xl font-bold text-[#3872FA]">
                                {sub.tier}
                              </div>
                              <div className="text-base font-medium mt-2">
                                {sub.domain}
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                {sub.start} → {sub.stop}
                              </div>
                            </div>

                            {/* Line from main to sub */}
                            {subIndex === 0 && (
                              <div className="absolute left-0 top-0 -translate-x-full w-12 h-0.5 bg-[#3872FA]" />
                            )}

                            {/* Line between sub cards */}
                            {subIndex < subTierData[item.id].length - 1 && (
                              <div className="absolute left-1/2 top-full w-0.5 h-12 bg-[#3872FA] -translate-x-1/2" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompetitorDetailsTable;
