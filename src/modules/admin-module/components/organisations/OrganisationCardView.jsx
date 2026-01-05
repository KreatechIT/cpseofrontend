import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  OrgActionButtons,
  OrgNameAndMember,
  OrgProducts,
  OrgThreeDotsDropdown,
} from "./OrganisationBlocks";
import usePermission from "@/hooks/usePermission";

const OrganisationCardView = ({ filteredOrganisations }) => {
  return (
    <div className="@8xl:grid-cols-4 grid grid-cols-1 gap-4 @2xl:grid-cols-2 @5xl:grid-cols-3">
      {filteredOrganisations.map((org) => (
        <OrganisationCard key={org.id} organisation={org} />
      ))}

      {filteredOrganisations.length === 0 && <p>No organisations found</p>}
    </div>
  );
};

export default OrganisationCardView;

const OrganisationCard = ({ organisation }) => {
  const { hasAnyPermission } = usePermission();

  return (
    <Card className="flex flex-col justify-between overflow-hidden rounded-xl">
      <CardHeader className="relative flex items-center justify-between gap-4">
        <OrgNameAndMember organisation={organisation} />

        {hasAnyPermission(["organisation.edit", "organisation.archive"]) && (
          <OrgThreeDotsDropdown organisation={organisation} />
        )}
      </CardHeader>

      <CardContent className="-mt-2 text-sm">
        <div>
          <p className="text-muted-foreground mt-0">
            <span className="text-foreground font-medium">Address:</span>{" "}
            <span>{organisation?.address}</span>
          </p>
        </div>

        {/* Products */}
        <div className="bg-primary/5 relative mt-4 h-24 rounded-lg border border-black/5 p-2 dark:border-white/10">
          <p className="font-medium">Products</p>
          <OrgProducts organisation={organisation} />
        </div>
      </CardContent>

      <CardFooter className="-mt-1.5">
        <OrgActionButtons organisation={organisation} />
      </CardFooter>
    </Card>
  );
};
