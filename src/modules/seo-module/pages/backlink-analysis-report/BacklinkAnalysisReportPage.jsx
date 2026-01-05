import { useState } from "react";
import { PageHeading } from "@/components/shared/PageHeading";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import TotalLinks from "../../components/backlink-analysis-report/TotalLinks"; // We'll create this next

const BacklinkAnalysisReportPage = () => {
  const [selectedReport, setSelectedReport] = useState("total-links"); // Default to Total Links

  const buttons = [
    { label: "Backlinks", subs: ["Total Links", "Index Rate", "Link Types"], values: ["total-links", "index-rate", "link-types"] },
    { label: "Vendor", subs: ["Vendor Overview", "Frequent Used Vendor"], values: ["vendor-overview", "frequent-vendor"] },
    { label: "Keyword", subs: ["Keyword Density", "Keyword Cost"], values: ["keyword-density", "keyword-cost"] },
    { label: "Backlinks Opportunity", subs: ["Backlinks Opportunity"], values: ["backlinks-opportunity"] },
    { label: "Vendor Overview", subs: ["Vendor Overview"], values: ["vendor-overview"] },
  ];
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
  return (
    <>
      <title>Backlink Analysis Report - Core360</title>
      <main className="mt-1 flex h-full flex-col p-6">
        <PageHeading pageTitle="Backlink Analysis Report" />
        {/* Dropdown Buttons */}
        <div className="flex flex-wrap gap-4 mt-6 border-b p-4">
          {buttons.map((btn, index) => (
            <DropdownMenu key={index}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={btn.values.includes(selectedReport) ? "default" : "outline"}
                  className={cn(
                    "transition-all",
                    btn.values.includes(selectedReport) && "bg-blue-600 hover:bg-blue-700"
                  )}
                >
                  {btn.label} <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {btn.subs.map((sub, subIndex) => (
                  <DropdownMenuItem key={subIndex} onClick={() => setSelectedReport(btn.values[subIndex])}>
                    {sub}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </div>

        {/* Load Selected Component */}
        <div className="mt-8">
          {selectedReport === "total-links" && <TotalLinks />}
          {/* Add other components here as we build them */}
          {/* e.g., if (selectedReport === "index-rate") <IndexRate /> */}
        </div>
      </main>
    </>
  );
};

export default BacklinkAnalysisReportPage;