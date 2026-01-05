import { PageHeading } from "@/components/shared/PageHeading";
import SeRankingImportForm from "../../components/se-ranking-import/SeRankingImportForm";

const SeRankingImportPage = () => {
  return (
    <>
      <title>SE Ranking Import - Core360</title>
      <main className="mt-1 flex h-full flex-col p-6">
        <PageHeading pageTitle="SE Ranking Import" />
        <SeRankingImportForm />
      </main>
    </>
  );
};

export default SeRankingImportPage;