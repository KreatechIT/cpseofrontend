import { PageHeading } from "@/components/shared/PageHeading";
import SeRankingReport from "../../components/se-ranking-report/SeRankingReport";

const SeRankingReportPage = () => {
  return (
    <>
      <title>SE Ranking Report - Core360</title>
      <main className="mt-1 flex h-full flex-col p-6">
        <PageHeading pageTitle="SE Ranking Report" />
        <SeRankingReport />
      </main>
    </>
  );
};

export default SeRankingReportPage;