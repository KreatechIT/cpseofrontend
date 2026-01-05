import { PageHeading } from "@/components/shared/PageHeading";
import ConversionImportForm from "../../components/conversion-import/ConversionImportForm";

const ConversionImportPage = () => {
  return (
    <>
      <title>Conversion Import - Core360</title>
      <main className="mt-1 flex h-full flex-col p-6">
        <PageHeading pageTitle="Conversion Import" />
        <ConversionImportForm />
      </main>
    </>
  );
};

export default ConversionImportPage;