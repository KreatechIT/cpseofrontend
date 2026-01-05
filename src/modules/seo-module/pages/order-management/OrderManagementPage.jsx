import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../../services/orderManagementService";
import { PageHeading } from "@/components/shared/PageHeading";
import { CardSkeletons } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OrderManagementFilters from "../../components/order-management/OrderManagementFilters";

const OrderManagementPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { orders } = useSelector((state) => state.orderManagement);
  const loading = !orders;

  useEffect(() => {
    if (user?.organisation_id && !orders) {
      getAllOrders(dispatch);
    }
  }, [dispatch, user?.organisation_id, orders]);

  const handleAddOrder = () => {
    navigate("/seo/order-management/add");
  };

  return (
    <>
      <title>Order Management - Core360</title>
      <main className="mt-1 flex h-full flex-col p-6">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between mb-8">
          <PageHeading pageTitle="Order Management" />
          {/* <Button onClick={handleAddOrder}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Order
          </Button> */}
        </div>

        {/* Content */}
        {loading ? (
          <CardSkeletons />
        ) : (
          <OrderManagementFilters orders={orders || []} />
        )}
      </main>
    </>
  );
};

export default OrderManagementPage;
