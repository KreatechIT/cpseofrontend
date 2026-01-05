import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getJobStatusColor } from "@/utils/getStatusColor";

import usePermission from "@/hooks/usePermission";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { CalendarIcon, EditIcon, TrashIcon } from "lucide-react";
import { setDialogData } from "@/store/reducers/dialogSlice";

import { format } from "date-fns";
import { JobsThreeDotsDropdown } from "./JobPostBlocks";
import { decodeHtml } from "../job-apply/JobDetailsView";

const JobPostTableView = ({ filteredJobPosts }) => {
  return (
    <div className="overflow-hidden rounded-lg">
      <Table>
        <TableHeader className="border">
          <TableRow>
            <TableHead className="p-3">Date</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Department</TableHead>

            <TableHead>Job Description</TableHead>
            <TableHead>Vacancies</TableHead>
            <TableHead>Status</TableHead>

            <TableHead>Action</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredJobPosts.map((jobPost) => (
            <TableRow key={jobPost.id}>
              <TableCell className="pl-3 py-3.5 flex items-center gap-2">
                <CalendarIcon className="size-4" />
                {format(jobPost.created, "PP")}
              </TableCell>
              <TableCell>{jobPost?.job_title}</TableCell>
              <TableCell>{jobPost?.department}</TableCell>

              <TableCell className="max-w-[14rem] min-w-60 break-words whitespace-normal">
                <div
                  dangerouslySetInnerHTML={{
                    __html: decodeHtml(jobPost.job_description),
                  }}
                  className="line-clamp-2"
                />
              </TableCell>
              <TableCell>{jobPost?.vacancy}</TableCell>
              <TableCell>
                {
                  <Badge
                    className={`px-3 text-black ${getJobStatusColor(
                      jobPost?.status
                    )}`}
                  >
                    {jobPost?.status}
                  </Badge>
                }
              </TableCell>

              <TableCell>
                <ActionButtons jobPost={jobPost} />
              </TableCell>
              <TableCell>
                <JobsThreeDotsDropdown jobPosting={jobPost} />
              </TableCell>
            </TableRow>
          ))}

          {filteredJobPosts.length === 0 && (
            <TableRow>
              <TableCell colSpan={7}>No jobs found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default JobPostTableView;

const ActionButtons = ({ jobPost }) => {
  const dispatch = useDispatch();
  const { hasPermission } = usePermission();

  return (
    <div className="flex gap-2 w-full max-w-50 items-center">
      {hasPermission("hr_job_posting.archive") && (
        <Button
          variant="destructive"
          size="xs"
          className="flex-grow"
          onClick={() => {
            dispatch(
              setDialogData({
                type: "archivejobPosting",
                props: jobPost,
                styles: "md:min-w-[650px]",
              })
            );
          }}
        >
          <TrashIcon />
          Archive
        </Button>
      )}

      {hasPermission("hr_job_posting.edit") &&
        jobPost.status !== "Cancelled" &&
        jobPost.status !== "Completed" && (
          <Button
            className="bg-green-600 dark:bg-green-700 flex-grow hover:bg-green-700 dark:hover:bg-green-800"
            size="xs"
            onClick={() => {
              dispatch(
                setDialogData({
                  type: "editjobPosting",
                  props: jobPost,
                  styles: "md:min-w-[750px] lg:min-w-[850px] xl:min-w-[1050px]",
                })
              );
            }}
          >
            <EditIcon />
            Edit
          </Button>
        )}
    </div>
  );
};
