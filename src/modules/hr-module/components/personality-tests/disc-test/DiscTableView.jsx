import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import usePermission from "@/hooks/usePermission";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { CalendarIcon, EditIcon, TrashIcon } from "lucide-react";
import { setDialogData } from "@/store/reducers/dialogSlice";

import { format } from "date-fns";
import { toggleDiscQuestionStatus } from "@/modules/hr-module/services/personalityTestService";
import { cn } from "@/utils/cn";

const DiscTableView = ({ filteredDiscQuestions }) => {
  return (
    <div className="overflow-hidden rounded-lg">
      <Table>
        <TableHeader className="border">
          <TableRow>
            <TableHead className="p-3">Date</TableHead>
            <TableHead>Question</TableHead>

            <TableHead>Status</TableHead>

            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredDiscQuestions.map((question) => (
            <TableRow key={question.id}>
              <TableCell className="pl-3 py-3.5 flex items-center gap-2">
                <CalendarIcon className="size-4" />
                {format(question.created, "PP")}
              </TableCell>

              <TableCell>
                <div className="max-w-sm whitespace-pre-wrap break-words">
                  {question?.question}
                </div>
              </TableCell>

              <TableCell
                className={cn(
                  question.is_active ? "text-green-500" : "text-destructive"
                )}
              >
                {question?.is_active ? "Active" : "Inactive"}
              </TableCell>

              <TableCell>
                <ActionButtons question={question} />
              </TableCell>
            </TableRow>
          ))}

          {filteredDiscQuestions.length === 0 && (
            <TableRow>
              <TableCell colSpan={7}>No disc questions found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DiscTableView;

const ActionButtons = ({ question }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { hasPermission } = usePermission();

  return (
    <div className="flex gap-2 w-full max-w-80  items-center">
      {hasPermission("hr_disc_questions.archive") && (
        <Button
          variant="destructive"
          size="xs"
          className="flex-grow"
          onClick={() => {
            dispatch(
              setDialogData({
                type: "archiveDiscQuestion",
                props: question,
                styles: "md:min-w-[650px]",
              })
            );
          }}
        >
          <TrashIcon />
          Archive
        </Button>
      )}

      {hasPermission("hr_disc_questions.edit") && (
        <Button
          className="bg-green-600 dark:bg-green-700 flex-grow hover:bg-green-700 dark:hover:bg-green-800"
          size="xs"
          onClick={() => {
            dispatch(
              setDialogData({
                type: "editDiscQuestion",
                props: question,
                styles: "md:min-w-[750px] lg:min-w-[850px] xl:min-w-[1050px]",
              })
            );
          }}
        >
          <EditIcon />
          Edit
        </Button>
      )}

      {hasPermission("hr_disc_questions.edit") && (
        <Button
          variant="outline"
          size="xs"
          onClick={() =>
            toggleDiscQuestionStatus(
              user?.organisation_id,
              question.id,
              { is_active: !question.is_active },
              dispatch
            )
          }
        >
          Mark as {question.is_active ? "Inactive" : "Active"}
        </Button>
      )}
    </div>
  );
};
