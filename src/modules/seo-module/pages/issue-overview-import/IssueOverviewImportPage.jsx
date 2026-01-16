import { PageHeading } from "@/components/shared/PageHeading";
import IssueOverviewImportForm from "../../components/issue-overview-import/IssueOverviewImportForm";

const IssueOverviewImportPage = () => {
  return (
    <>
      <title>Issue Overview Import - Core360</title>
      <main className="mt-1 flex h-full flex-col p-6">
        <PageHeading pageTitle="Issue Overview Import" />
        <IssueOverviewImportForm />
      </main>
    </>
  );
};

export default IssueOverviewImportPage;