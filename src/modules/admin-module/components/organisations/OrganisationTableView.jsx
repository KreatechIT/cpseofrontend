import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  OrgThreeDotsDropdown,
  OrgActionButtons,
  OrgNameAndMember,
  OrgProducts,
} from "./OrganisationBlocks";
import usePermission from "@/hooks/usePermission";

const OrganisationTableView = ({ filteredOrganisations }) => {
  const { hasAnyPermission } = usePermission();

  return (
    <div className="overflow-hidden rounded-lg">
      <Table>
        <TableHeader className="border">
          <TableRow>
            <TableHead className="p-3">Organisation</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Actions</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredOrganisations.map((organisation) => (
            <TableRow key={organisation.id}>
              <TableCell>
                <OrgNameAndMember organisation={organisation} view="table" />
              </TableCell>
              <TableCell className="max-w-[16rem] min-w-60 break-words whitespace-normal">
                {organisation.address}
              </TableCell>
              <TableCell>
                <OrgProducts organisation={organisation} />
              </TableCell>
              <TableCell className="min-w-64">
                <OrgActionButtons organisation={organisation} view="table" />
              </TableCell>
              <TableCell>
                {hasAnyPermission([
                  "organisation.edit",
                  "organisation.archive",
                ]) && <OrgThreeDotsDropdown organisation={organisation} />}
              </TableCell>
            </TableRow>
          ))}

          {filteredOrganisations.length === 0 && (
            <TableRow>
              <TableCell colSpan={5}>No organisations found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrganisationTableView;
