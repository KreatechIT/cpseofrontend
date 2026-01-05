import { PageHeading } from "@/components/shared/PageHeading";
import AhrefsImportForm from "../../components/ahrefs-import/AhrefsImportForm";

const AhrefsImportPage = () => {
  return (
    <>
      <title>Ahrefs Import - Core360</title>
      <main className="mt-1 flex h-full flex-col p-6">
        <PageHeading pageTitle="Ahrefs Import" />
        <AhrefsImportForm />
      </main>
    </>
  );
};

export default AhrefsImportPage;
