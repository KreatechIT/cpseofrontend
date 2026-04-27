import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPurchased } from "../../services/purchasedPoolService";
import { PageHeading } from "@/components/shared/PageHeading";
import { TableSkeleton } from "@/components/ui/skeleton";
import PurchasedPoolFilters from "../../components/purchased-pool/PurchasedPoolFilters";

const PurchasedPoolPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { purchased, pagination, loading } = useSelector((state) => state.purchasedPool);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data when page changes
  useEffect(() => {
    if (user?.organisation_id) {
      getAllPurchased(dispatch, currentPage);
    }
  }, [dispatch, user?.organisation_id, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <title>Purchased Pool - Core360</title>
      <main className="mt-1 flex h-full flex-col p-6">
        <PageHeading pageTitle="Purchased Pool" />

        {loading ? (
          <TableSkeleton />
        ) : (
          <PurchasedPoolFilters 
            purchased={purchased || []} 
            pagination={pagination}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </main>
    </>
  );
};

export default PurchasedPoolPage;
