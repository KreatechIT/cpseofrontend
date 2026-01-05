import { useState } from "react";
import { PageHeading } from "@/components/shared/PageHeading";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import PerformanceOverview from "../../components/performance-analysis-report/PerformanceOverview";

const PerformanceAnalysisReportPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Performance Overview" },
    { id: "search-console", label: "Search Console" },
    { id: "analytics", label: "Analytics" },
    { id: "conversion", label: "Conversion" },
  ];

  return (
    <>
      <title>Performance Analysis Report - Core360</title>
      <main className="mt-1 flex h-full flex-col p-6">
        <PageHeading pageTitle="Performance Analysis Report" />

        {/* Tab Buttons */}
        <div className="mt-6">
          <div className="inline-flex justify-between rounded-lg border p-3 w-full">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className={cn(
                  "rounded-md px-6 transition-all border",
                  activeTab === tab.id && "bg-blue-600 hover:bg-blue-700 shadow-sm "
                )}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="mt-8">
          {activeTab === "overview" && <PerformanceOverview />}
          {/* Future tabs will go here */}
          {activeTab === "search-console" && (
            <div className="text-center py-12 text-muted-foreground">
              Search Console report coming soon...
            </div>
          )}
          {activeTab === "analytics" && (
            <div className="text-center py-12 text-muted-foreground">
              Analytics report coming soon...
            </div>
          )}
          {activeTab === "conversion" && (
            <div className="text-center py-12 text-muted-foreground">
              Conversion report coming soon...
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default PerformanceAnalysisReportPage;