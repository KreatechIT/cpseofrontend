import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getJobStatusColor } from "@/utils/getStatusColor";
import { JobsThreeDotsDropdown } from "./JobPostBlocks";
import { formatDate } from "date-fns";
import {
  ChevronDown,
  ClipboardList,
  EditIcon,
  FileTextIcon,
  TrashIcon,
} from "lucide-react";
import usePermission from "@/hooks/usePermission";
import { useDispatch } from "react-redux";
import { setDialogData } from "@/store/reducers/dialogSlice";
import { Button } from "@/components/ui/button";
import { decodeHtml } from "../job-apply/JobDetailsView";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const SingleJobPostDetails = ({
  jobPost,
  maleCount,
  femaleCount,
  totalCount,
}) => {
  const { hasPermission } = usePermission();
  const dispatch = useDispatch();
  return (
    <div className="mb-4">
      <div className="flex">
        <Card className="w-full max-w-md flex flex-col overflow-hidden rounded-xl border shadow-sm">
          <CardHeader className="pb-0">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold opacity-90">
                {jobPost.job_title}
              </h3>
              <div className="flex items-center gap-2">
                <Badge
                  className={`text-xs font-medium px-3 rounded-full ${getJobStatusColor(
                    jobPost?.status
                  )}`}
                  variant="outline"
                >
                  {jobPost?.status}
                </Badge>

                <JobsThreeDotsDropdown jobPosting={jobPost} />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-2 text-sm text-foreground/90 -mt-6">
            <div className="grid gap-1">
              <div className="flex">
                <span className="w-28 text-muted-foreground">Company:</span>
                <span className="truncate">{jobPost.company}</span>
              </div>
              <div className="flex">
                <span className="w-28 text-muted-foreground">Department:</span>
                <span className="truncate">{jobPost.department}</span>
              </div>
              <div className="flex">
                <span className="w-28 text-muted-foreground">Posted:</span>
                <span>{formatDate(jobPost.created, "PP")}</span>
              </div>
              <div className="flex">
                <span className="w-28 text-muted-foreground">Deadline:</span>
                <span>{formatDate(jobPost.application_deadline, "PP")}</span>
              </div>
              <div className="flex">
                <span className="w-28 text-muted-foreground">Job Type:</span>
                <span>{jobPost.job_type}</span>
              </div>
              <div className="flex">
                <span className="w-28 text-muted-foreground">Salary:</span>
                <span>{jobPost.salary}</span>
              </div>
              <div className="flex">
                <span className="w-28 text-muted-foreground">Location:</span>
                <span>{jobPost.location}</span>
              </div>
              <div className="flex">
                <span className="w-28 text-muted-foreground">Vacancies:</span>
                <span>
                  {jobPost.vacancy} position{jobPost.vacancy !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="flex gap-2 w-full mt-4">
              {hasPermission("hr_job_posting.archive") && (
                <Button
                  variant="outline"
                  className="flex-grow border-destructive dark:border-destructive text-destructive"
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
                    onClick={() => {
                      dispatch(
                        setDialogData({
                          type: "editjobPosting",
                          props: jobPost,
                          styles:
                            "md:min-w-[750px] lg:min-w-[850px] xl:min-w-[1050px]",
                        })
                      );
                    }}
                  >
                    <EditIcon />
                    Edit
                  </Button>
                )}
            </div>
          </CardContent>
        </Card>

        <Card className="flex-grow border shadow-sm rounded-xl ml-4">
          <CardContent className="p-0 flex items-center h-full">
            <div className="grid grid-cols-3 divide-x w-full h-full">
              <div className="flex flex-col items-center justify-center p-4">
                <p className="text-base font-normal text-secondary-foreground">
                  Male
                </p>
                <p className="text-6xl font-bold text-blue-600 mt-1">
                  {maleCount}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center p-4">
                <p className="text-base font-normal text-secondary-foreground">
                  Female
                </p>
                <p className="text-6xl font-bold text-blue-600 mt-1">
                  {femaleCount}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center p-4">
                <p className="text-base font-normal text-secondary-foreground">
                  Total Applicants
                </p>
                <p className="text-6xl font-bold  mt-1">{totalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      <Collapsible>
        <CollapsibleTrigger asChild>
          <button className="flex items-center gap-2 text-muted-foreground mt-6 font-medium w-full hover:underline">
            <FileTextIcon className="size-4.5" />
            Job Description
            <ChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </button>
        </CollapsibleTrigger>
        <Separator className="my-2" />
        <CollapsibleContent>
          <div
            className="ProseMirror"
            dangerouslySetInnerHTML={{
              __html: decodeHtml(jobPost.job_description),
            }}
          />
        </CollapsibleContent>
      </Collapsible>

      {/* Requirements */}
      <Collapsible>
        <CollapsibleTrigger asChild>
          <button className="flex items-center gap-2 text-muted-foreground mt-6 font-medium w-full hover:underline">
            <ClipboardList className="size-4.5" />
            Job Requirements
            <ChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </button>
        </CollapsibleTrigger>
        <Separator className="my-2" />
        <CollapsibleContent>
          <div
            className="ProseMirror"
            dangerouslySetInnerHTML={{
              __html: decodeHtml(jobPost.job_requirement),
            }}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default SingleJobPostDetails;
