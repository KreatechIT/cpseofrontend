import { PageHeading } from "@/components/shared/PageHeading";
import PurchaseImportForm from "../../components/purchase-import/PurchaseImportForm";

const PurchaseImportPage = () => {
  return (
    <>
      <title>Purchase Import - Core360</title>
      <main className="mt-1 flex h-full flex-col p-6">
        <PageHeading pageTitle="Purchase Import" />
        <PurchaseImportForm />
      </main>
    </>
  );
};

export default PurchaseImportPage;
