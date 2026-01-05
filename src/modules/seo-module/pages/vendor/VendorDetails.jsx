import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllVendors } from "../../services/vendorDatabaseService";
import { PageHeading } from "@/components/shared/PageHeading";
import VendorDatabaseFilters from "../../components/vendor-database/VendorDatabaseFilters";
import { CardSkeletons } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VendorDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  // Safely get vendors — avoid crash if slice not registered
  const vendorState = useSelector((state) => state.vendorDatabase);
  const vendors = vendorState?.vendors || null;

  const loading = !vendors; // true while fetching or if null

  useEffect(() => {
    if (user?.organisation_id && !vendors) {
      getAllVendors(user.organisation_id, dispatch);
    }
  }, [user?.organisation_id, vendors, dispatch]);

  const handleAddVendor = () => {
    navigate("/seo/vendor/vendor-details/add");
  };

  return (
    <>
      <title>Vendor Registration - Core360</title>
      <main className="mt-1 flex h-full flex-col p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <PageHeading
            pageTitle="Vendor Registration"
            withCardTableView={true}
          />
          <Button onClick={handleAddVendor}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Vendor
          </Button>
        </div>

        {/* Content */}
        {loading ? (
          <CardSkeletons />
        ) : (
          <VendorDatabaseFilters
            vendors={vendors || []}
            // No need for departments/vendorTypes unless you're using them in filters
          />
        )}
      </main>
    </>
  );
};

export default VendorDetails;