import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useSelector } from "react-redux";
import { getStatusColor } from "@/utils/getStatusColor";

const VacancyDetailedView = () => {
  const vacancy = useSelector((state) => state.dialog.props);

  return (
    <div className="-mt-6">
      <h2 className="text-xl font-medium text-center">
        Hiring Applicant Details
      </h2>

      <div className="space-y-4 px-2 md:px-4 py-2 text-sm text-muted-foreground mt-4">
        <div className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-xs mb-1">Date</p>
              <p className="text-foreground font-medium">
                {format(new Date(vacancy.date), "PPP")}
              </p>
            </div>
            <div>
              <p className="text-xs mb-1">Position</p>
              <p className="text-foreground font-medium">{vacancy.position}</p>
            </div>
            <div>
              <p className="text-xs mb-1">Department</p>
              <p className="text-foreground font-medium">
                {vacancy.department || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs mb-1">Number of Vacancies</p>
              <p className="text-foreground font-medium">
                {vacancy.number_of_vacancies}
              </p>
            </div>

            {/* Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs mb-1">Status</p>
                <Badge
                  className={`px-3 py-1 text-black ${getStatusColor(
                    vacancy.status
                  )}`}
                >
                  {vacancy.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-black/10 dark:bg-white/10" />

        {/* Submission Info */}
        <div className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs mb-1">Submitted By</p>
              <p className="text-foreground font-medium">
                {vacancy.submitted_by || "-"}
              </p>
            </div>
            {vacancy.status !== "Pending" && (
              <div>
                <p className="text-xs mb-1">
                  {vacancy.status === "Approved" ? "Approved" : "Rejected"} By
                </p>
                <p className="text-foreground font-medium">
                  {vacancy.handler || "-"}
                </p>
              </div>
            )}
          </div>
        </div>

        <Separator className="bg-black/10 dark:bg-white/10" />

        <div className="flex items-start gap-2 bg-primary/5 mt-4 p-2 rounded-md">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground font-medium mb-1 flex gap-2 items-center">
              Reason for hiring:
            </p>
            <p className="text-foreground">{vacancy.reason_for_hiring}</p>
          </div>
        </div>

        {vacancy.status === "Rejected" && (
          <div className="flex items-start gap-2 bg-destructive/5 mt-4 p-2 rounded-md">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground font-medium mb-1 flex gap-2 items-center">
                Reject reason
              </p>
              <p className="line-clamp-2  text-destructive/75">
                {vacancy.reject_reason}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VacancyDetailedView;
