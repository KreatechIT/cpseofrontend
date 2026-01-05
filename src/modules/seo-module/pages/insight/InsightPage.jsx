import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInsightData } from "../../services/insightService";
import { PageHeading } from "@/components/shared/PageHeading";
import InsightTable from "../../components/insight/InsightTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const InsightPage = () => {
  const dispatch = useDispatch();
  const { purchased, samples, competitorPool, loading } = useSelector((state) => state.insight);

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchInsightData(dispatch);
  }, [dispatch]);

  const allData = [...(purchased || []), ...(samples || []), ...(competitorPool || [])];

  // Prepare vendor summary data
  const vendorSummaryData = allData
    .filter(row => row.vendor || row.associated_vendors || row.price_usd || row.discovered_date)
    .map((row, index) => ({
      no: index + 1,
      associated: row.associated_vendors || row.vendor || "-",
      vendors: row.vendor || row.associated_vendors || "-",
      price: row.price_usd || row.price_usd_general || row.price_usd_niche || "-",
      note: row.remark || row.note || "-",
      discoveredDate: row.discovered_date || row.created_date || row.first_seen || "-",
      discoveredBy: row.discovered_by || row.created_by || "-",
      overlapCompetitors: row.overlap_competitors || "-",
      projectConsistsLink: row.project_consists_link || "-",
    }));

  return (
    <>
      <title>Insight - Core360</title>
      <main className="p-6">
        <div className="flex items-center justify-between mb-6">
          <PageHeading pageTitle="Insight" />
          <Button onClick={() => setModalOpen(true)}>
            Vendor Summary
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading data...</div>
        ) : (
          <InsightTable data={allData} />
        )}
      </main>

      {/* Vendor Summary Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-scroll w-full sm:max-w-xxl">
          <DialogHeader>
            <DialogTitle>VENDOR SUMMARY</DialogTitle>
          </DialogHeader>
          <div className="mt-4 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Associated</TableHead>
                  <TableHead>Vendors</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Discovered Date</TableHead>
                  <TableHead>Discovered By</TableHead>
                  <TableHead>Overlap Competitors</TableHead>
                  <TableHead>Project Consists Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendorSummaryData.length > 0 ? (
                  vendorSummaryData.map((item) => (
                    <TableRow key={item.no}>
                      <TableCell>{item.no}</TableCell>
                      <TableCell>{item.associated}</TableCell>
                      <TableCell>{item.vendors}</TableCell>
                      <TableCell>{item.price}</TableCell>
                      <TableCell>{item.note}</TableCell>
                      <TableCell>{item.discoveredDate}</TableCell>
                      <TableCell>{item.discoveredBy}</TableCell>
                      <TableCell>{item.overlapCompetitors}</TableCell>
                      <TableCell>{item.projectConsistsLink}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      No vendor data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InsightPage;