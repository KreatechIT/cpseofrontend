import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import usePermission from "@/hooks/usePermission";
import { format } from "date-fns";
import {
  CalendarIcon,
  EditIcon,
  FileTextIcon,
  TrashIcon,
  UsersIcon,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { JobsThreeDotsDropdown } from "./JobPostBlocks";
import { getJobStatusColor } from "@/utils/getStatusColor";
import NoJobPostImg from "@/assets/images/no-job-post.svg";
import { setDialogData } from "@/store/reducers/dialogSlice";
import { Button } from "@/components/ui/button";
import { decodeHtml } from "../job-apply/JobDetailsView";

export default function JobPostCardView({ filteredJobPosts }) {
  return (
    <>
      <div className="@8xl:grid-cols-4 grid grid-cols-1 gap-4 @2xl:grid-cols-2 @5xl:grid-cols-3">
        {filteredJobPosts.map((jobPost) => (
          <JobPostCard key={jobPost.id} jobPost={jobPost} />
        ))}
      </div>
      {filteredJobPosts.length === 0 && (
        <div className="">
          <h2 className="text-xl font-medium">No job posts available.</h2>
          <div className="mt-12 flex justify-center">
            <img
              src={NoJobPostImg}
              alt="no vacancies available"
              className=" max-h-125 mx-auto"
            />
          </div>
        </div>
      )}
    </>
  );
}

const JobPostCard = function ({ jobPost }) {
  const dispatch = useDispatch();
  const { hasPermission } = usePermission();

  return (
    <Card className="flex flex-col overflow-hidden rounded-xl border shadow-sm">
      {/* Header */}
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

      {/* Content */}
      <CardContent className=" space-y-2 text-sm text-foreground/90 -mt-6">
        <div>
          <div className="flex items-center gap-1 text-sm mt-1">
            <span className="truncate">
              <span className="text-muted-foreground">Department:</span>{" "}
              {jobPost.department}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 ">
          <CalendarIcon className="h-4 w-4 flex-shrink-0 opacity-60" />
          <span>
            <span className="text-muted-foreground">Posted:</span>{" "}
            {format(jobPost.created, "PP")}
          </span>
        </div>

        <div className="flex items-center gap-2 ">
          <UsersIcon className="h-4 w-4 flex-shrink-0 opacity-60" />
          <span>
            <span className="text-muted-foreground">Vacancies:</span>{" "}
            {jobPost.vacancy} position
            {jobPost.vacancy !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-start gap-2 bg-primary/5 mt-4 p-2 rounded-md">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground font-medium mb-1 flex gap-2 items-center">
              <FileTextIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
              Job description:
            </p>
            <div
              dangerouslySetInnerHTML={{
                __html: decodeHtml(jobPost.job_description),
              }}
              className="line-clamp-5"
            />
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
  );
};
