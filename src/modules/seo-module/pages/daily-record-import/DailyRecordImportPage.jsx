import { PageHeading } from "@/components/shared/PageHeading";
import DailyRecordImportForm from "../../components/daily-record-import/DailyRecordImportForm";

const DailyRecordImportPage = () => {
  return (
    <>
      <title>Daily Record Import - Core360</title>
      <main className="mt-1 flex h-full flex-col p-6">
        <PageHeading pageTitle="Daily Record Import" />
        <DailyRecordImportForm />
      </main>
    </>
  );
};

export default DailyRecordImportPage;
