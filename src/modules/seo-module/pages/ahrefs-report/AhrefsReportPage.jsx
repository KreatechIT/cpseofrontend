import { PageHeading } from "@/components/shared/PageHeading";
import AhrefsReport from "../../components/ahrefs-report/AhrefsReport";

const AhrefsReportPage = () => {
  return (
    <>
      <title>Ahrefs Report - Core360</title>
      <main className="mt-1 flex h-full flex-col p-6">
        <PageHeading pageTitle="Ahrefs Report" />
        <AhrefsReport />
      </main>
    </>
  );
};

export default AhrefsReportPage;