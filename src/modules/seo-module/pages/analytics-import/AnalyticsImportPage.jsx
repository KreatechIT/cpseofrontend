import { PageHeading } from "@/components/shared/PageHeading";
import AnalyticsImportForm from "../../components/analytics-import/AnalyticsImportForm";

const AnalyticsImportPage = () => {
  return (
    <>
      <title>Analytics Import - Core360</title>
      <main className="mt-1 flex h-full flex-col p-6">
        <PageHeading pageTitle="Analytics Import" />
        <AnalyticsImportForm />
      </main>
    </>
  );
};

export default AnalyticsImportPage;