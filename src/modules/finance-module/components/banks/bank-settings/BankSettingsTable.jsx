import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import usePermission from "@/hooks/usePermission";
import { setDialogData } from "@/store/reducers/dialogSlice";
import { Trash2Icon } from "lucide-react";
import { useDispatch } from "react-redux";

const BankSettingsTable = ({ filteredTransactionDescriptions }) => {
  const dispatch = useDispatch();
  const { hasPermission } = usePermission();

  return (
    <div className="overflow-hidden rounded-lg">
      <Table>
        <TableHeader className="border">
          <TableRow>
            <TableHead className="p-3 py-3.5">Description</TableHead>
            <TableHead>Purpose</TableHead>

            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredTransactionDescriptions.map((tDes) => (
            <TableRow key={tDes.id}>
              <TableCell className="p-3 py-3.5 flex items-center gap-2">
                {tDes.description}
              </TableCell>

              <TableCell>{tDes?.purpose}</TableCell>

              <TableCell>
                <div className="flex max-w-[4rem] gap-2.5">
                  {hasPermission("finance_bank.archive") && (
                    <Button
                      size="xs"
                      variant="destructive"
                      onClick={() =>
                        dispatch(
                          setDialogData({
                            type: "archiveTransactionDescription",
                            props: tDes,
                          })
                        )
                      }
                    >
                      <Trash2Icon /> Archive
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}

          {filteredTransactionDescriptions.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>No descriptions found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BankSettingsTable;
