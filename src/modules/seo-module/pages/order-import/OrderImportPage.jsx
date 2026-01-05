import { PageHeading } from "@/components/shared/PageHeading";
import OrderImportForm from "../../components/order-import/OrderImportForm";

const OrderImportPage = () => {
  return (
    <>
      <title>Order Import - Core360</title>
      <main className="mt-1 flex h-full flex-col p-6">
        <PageHeading pageTitle="Order Import" />
        <OrderImportForm />
      </main>
    </>
  );
};

export default OrderImportPage;