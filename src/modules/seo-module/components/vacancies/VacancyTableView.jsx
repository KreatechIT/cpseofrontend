import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStatusColor } from "@/utils/getStatusColor";

import usePermission from "@/hooks/usePermission";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  CheckIcon,
  MessageCircle,
  ReceiptTextIcon,
  XIcon,
} from "lucide-react";
import { setDialogData } from "@/store/reducers/dialogSlice";
import { approveVacancy } from "../../services/hiringVacancyService";

const VacancyTableView = ({ filteredVacancies }) => {
  const dispatch = useDispatch();

  return (
    <div className="overflow-hidden rounded-lg">
      <Table>
        <TableHeader className="border">
          <TableRow>
            <TableHead className="p-3">Date</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Reason for Hiring</TableHead>
            <TableHead>
              Number of <br /> Vacancies
            </TableHead>
            <TableHead>Submitted By</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Status</TableHead>

            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredVacancies.map((vacancy) => (
            <TableRow key={vacancy.id}>
              <TableCell className="pl-3 py-3.5 flex items-center gap-2">
                <CalendarIcon className="size-4" />
                {vacancy.date}
              </TableCell>
              <TableCell className="">{vacancy?.department}</TableCell>
              <TableCell>{vacancy?.position}</TableCell>
              <TableCell>
                <div className="max-w-[16rem] min-w-60 break-words whitespace-normal line-clamp-2">
                  {vacancy?.reason_for_hiring}
                </div>
              </TableCell>
              <TableCell>{vacancy?.number_of_vacancies}</TableCell>
              <TableCell>{vacancy?.submitted_by || "-"}</TableCell>
              <TableCell>
                <div className="flex max-w-30">
                  <Button
                    size="xs"
                    variant="outline"
                    className="border-primary/75 dark:border-primary/75 font-normal text-xs"
                    onClick={() =>
                      dispatch(
                        setDialogData({
                          type: "vacancyDetails",
                          props: vacancy,
                        })
                      )
                    }
                  >
                    <ReceiptTextIcon className="opacity-75" /> View Details
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                {
                  <Badge
                    className={`px-3 text-black ${getStatusColor(
                      vacancy?.status
                    )}`}
                  >
                    {vacancy?.status}
                  </Badge>
                }
              </TableCell>

              <TableCell>
                <ActionButtons vacancy={vacancy} />
              </TableCell>
            </TableRow>
          ))}

          {filteredVacancies.length === 0 && (
            <TableRow>
              <TableCell colSpan={7}>No vacancies found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default VacancyTableView;

const ActionButtons = ({ vacancy }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { hasPermission } = usePermission();

  const handleApprove = () => {
    approveVacancy(user?.organisation_id, vacancy.id, dispatch);
  };

  return (
    <div className="flex gap-2 max-w-50 items-center h-full">
      {/* Approve: Only show when
            1. Status is Pending and User has "Approve" permission.
        */}
      {hasPermission("hr_hiring_vacancy.approve") &&
        vacancy.status === "Pending" && (
          <Button
            size="xs"
            className="bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800"
            onClick={handleApprove}
          >
            <CheckIcon /> Approve
          </Button>
        )}

      {/* Reject: Only show when
            1. Status is Pending and User has "Approve" permission.
        */}
      {hasPermission("hr_hiring_vacancy.approve") &&
        vacancy.status === "Pending" && (
          <Button
            size="xs"
            variant="destructive"
            onClick={() =>
              dispatch(
                setDialogData({
                  type: "rejectVacancy",
                  props: vacancy,
                })
              )
            }
          >
            <XIcon /> Reject
          </Button>
        )}

      {vacancy.status === "Rejected" && (
        <Button
          size="xs"
          variant="outline"
          onClick={() =>
            dispatch(
              setDialogData({
                type: "viewVacancyComment",
                props: vacancy,
              })
            )
          }
          className="text-xs"
        >
          <MessageCircle /> View Reason
        </Button>
      )}
    </div>
  );
};
