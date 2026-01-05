import { PageHeading } from "@/components/shared/PageHeading";
import { setDialogData } from "@/store/reducers/dialogSlice";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrganisations,
  getOrganisationProducts,
} from "../services/organisationByAdminService";
import { Button } from "@/components/ui/button";
import OrganisationFilters from "../components/organisations/OrganisationFilters";
import { CardSkeletons } from "@/components/ui/skeleton";
import usePermission from "@/hooks/usePermission";

const OrganisationsPageByAdmin = () => {
  const dispatch = useDispatch();
  const { hasPermission } = usePermission();
  const { organisations, organisationProducts } = useSelector(
    (state) => state.organisationsByAdmin
  );

  // Fetch Organisations, and Products
  useEffect(() => {
    if (!organisations) getAllOrganisations(dispatch);
    if (!organisationProducts) getOrganisationProducts(dispatch);
  }, []);

  return (
    <>
      <title>All Organisations - Core360</title>
      <main className="mt-1 flex h-full flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <PageHeading pageTitle="Organisations" withCardTableView={true} />
          <div className="">
            {hasPermission("organisation.add") && (
              <Button
                onClick={() => {
                  dispatch(
                    setDialogData({
                      type: "addOrganisation",
                      styles: "md:min-w-[750px] xl:min-w-[800px]",
                    })
                  );
                }}
              >
                Add Organisation <Plus />
              </Button>
            )}
          </div>
        </div>

        {organisations && organisationProducts ? (
          <OrganisationFilters
            organisations={organisations}
            organisationProducts={organisationProducts}
          />
        ) : (
          <CardSkeletons />
        )}
      </main>
    </>
  );
};

export default OrganisationsPageByAdmin;
