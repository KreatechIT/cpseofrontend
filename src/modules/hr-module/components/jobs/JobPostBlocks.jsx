import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  BanIcon,
  CheckCheckIcon,
  CheckLineIcon,
  Link2Icon,
  ReceiptTextIcon,
  RotateCcw,
} from "lucide-react";
import { ThreeDotsIcon } from "@/components/icons/Icons";

import { setDialogData } from "@/store/reducers/dialogSlice";
import { useDispatch, useSelector } from "react-redux";
import usePermission from "@/hooks/usePermission";
import { changeJobPostStatus } from "../../services/jobsService";
import { useNavigate } from "react-router-dom";

export function JobsThreeDotsDropdown({ jobPosting }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { hasPermission } = usePermission();

  const handlePublish = () => {
    changeJobPostStatus(
      user.organisation_id,
      jobPosting.id,
      { status: "1" },
      dispatch
    );
  };
  const handleCancel = () => {
    changeJobPostStatus(
      user.organisation_id,
      jobPosting.id,
      { status: "3" },
      dispatch
    );
  };
  const handleComplete = () => {
    changeJobPostStatus(
      user.organisation_id,
      jobPosting.id,
      { status: "2" },
      dispatch
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex cursor-pointer items-center justify-center px-2 pt-1">
          <ThreeDotsIcon className="scale-75" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuItem
          onClick={() =>
            navigate(`/hr/hiring-management/recruitment/jobs/${jobPosting.id}`)
          }
        >
          <ReceiptTextIcon size={16} aria-hidden="true" />
          <span>View Details</span>
        </DropdownMenuItem>

        {hasPermission("hr_job_posting.edit") &&
          (jobPosting.status === "Completed" ||
            jobPosting.status === "Cancelled") && (
            <DropdownMenuItem onClick={handlePublish}>
              <RotateCcw size={16} aria-hidden="true" />
              <span>Reactive</span>
            </DropdownMenuItem>
          )}

        {hasPermission("hr_job_posting.edit") &&
          jobPosting.status === "Draft" && (
            <DropdownMenuItem onClick={handlePublish}>
              <CheckLineIcon size={16} aria-hidden="true" />
              <span>Publish</span>
            </DropdownMenuItem>
          )}
        {hasPermission("hr_job_posting.edit") &&
          jobPosting.status === "Active" && (
            <DropdownMenuItem
              onClick={() => {
                dispatch(
                  setDialogData({
                    type: "generateLink",
                    props: jobPosting,
                    styles: "md:min-w-[750px] lg:min-w-[850px]",
                  })
                );
              }}
            >
              <Link2Icon size={16} aria-hidden="true" />
              <span>Job Link</span>
            </DropdownMenuItem>
          )}
        {jobPosting.status === "Active" &&
          hasPermission("hr_job_posting.edit") && (
            <DropdownMenuItem onClick={handleComplete}>
              <CheckCheckIcon size={16} aria-hidden="true" />
              <span>Mark as Complete</span>
            </DropdownMenuItem>
          )}
        {jobPosting.status === "Active" &&
          hasPermission("hr_job_posting.edit") && (
            <DropdownMenuItem onClick={handleCancel}>
              <BanIcon size={16} aria-hidden="true" />
              <span>Cancel</span>
            </DropdownMenuItem>
          )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
