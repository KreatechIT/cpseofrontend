import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPurchased } from "../../services/purchasedPoolService";
import { PageHeading } from "@/components/shared/PageHeading";
import { TableSkeleton } from "@/components/ui/skeleton";
import PurchasedPoolFilters from "../../components/purchased-pool/PurchasedPoolFilters";

const PurchasedPoolPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { purchased } = useSelector((state) => state.purchasedPool);
  const loading = !purchased;

  useEffect(() => {
    if (user?.organisation_id && !purchased) {
      getAllPurchased(dispatch);
    }
  }, [dispatch, user?.organisation_id, purchased]);

  return (
    <>
      <title>Purchased Pool - Core360</title>
      <main className="mt-1 flex h-full flex-col p-6">
        <PageHeading pageTitle="Purchased Pool" />

        {loading ? (
          <TableSkeleton />
        ) : (
          <PurchasedPoolFilters purchased={purchased || []} />
        )}
      </main>
    </>
  );
};

export default PurchasedPoolPage;
