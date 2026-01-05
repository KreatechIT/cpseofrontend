import { Card, CardContent, CardHeader } from "@/components/ui/card";
import usePermission from "@/hooks/usePermission";
import { setDialogData } from "@/store/reducers/dialogSlice";
import { useDispatch, useSelector } from "react-redux";
import { approveVacancy } from "../../services/hiringVacancyService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  CheckIcon,
  FileTextIcon,
  MessageCircleIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import { format } from "date-fns";
import NoVacanciesImg from "@/assets/images/no-hiring-vacancy.svg";
import { getStatusColor } from "@/utils/getStatusColor";

export default function VacancysCardView({ filteredVacancies }) {
  return (
    <>
      <div className="@8xl:grid-cols-4 grid grid-cols-1 gap-4 @2xl:grid-cols-2 @5xl:grid-cols-3">
        {filteredVacancies.map((vacancy) => (
          <VacancyCard key={vacancy.id} vacancy={vacancy} />
        ))}
      </div>

      {filteredVacancies.length === 0 && (
        <div className="">
          <h2 className="text-xl font-medium">No vacancies available.</h2>
          <div className="mt-12">
            <img
              src={NoVacanciesImg}
              alt="no vacancies available"
              className="w-full max-h-125 mx-auto"
            />
          </div>
        </div>
      )}
    </>
  );
}

const VacancyCard = function ({ vacancy }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { hasPermission } = usePermission();

  const handleApprove = () => {
    approveVacancy(user?.organisation_id, vacancy.id, dispatch);
  };

  return (
    <Card
      className="flex flex-col overflow-hidden rounded-xl border shadow-sm cursor-pointer"
      onClick={() =>
        dispatch(
          setDialogData({
            type: "vacancyDetails",
            props: vacancy,
          })
        )
      }
    >
      {/* Header */}
      <CardHeader className="pb-0">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold opacity-90">
            {vacancy.position}
          </h3>
          <div>
            <Badge
              className={`text-xs font-medium px-3 rounded-full ${getStatusColor(
                vacancy?.status
              )}`}
              variant="outline"
            >
              {vacancy?.status}
            </Badge>
          </div>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className=" space-y-3 text-sm text-foreground/90 -mt-6">
        <div>
          <div className="flex items-center gap-1 text-sm mt-1">
            <span className="truncate">
              <span className="text-muted-foreground">Department:</span>{" "}
              {vacancy.department}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 ">
          <CalendarIcon className="h-4 w-4 flex-shrink-0 opacity-60" />
          <span>
            <span className="text-muted-foreground">Posted:</span>{" "}
            {format(vacancy.date, "PP")}
          </span>
        </div>

        <div className="flex items-center gap-2 ">
          <UsersIcon className="h-4 w-4 flex-shrink-0 opacity-60" />
          <span>
            <span className="text-muted-foreground">Vacancies:</span>{" "}
            {vacancy.number_of_vacancies} position
            {vacancy.number_of_vacancies !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-start gap-2 bg-primary/5 mt-4 p-2 rounded-md">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground font-medium mb-1 flex gap-2 items-center">
              <FileTextIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
              Reason for hiring:
            </p>
            <p className="line-clamp-3">{vacancy.reason_for_hiring}</p>
          </div>
        </div>

        {vacancy.status === "Rejected" && (
          <div className="flex items-start gap-2 bg-destructive/5 mt-4 p-2 rounded-md">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground font-medium mb-1 flex gap-2 items-center">
                <MessageCircleIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
                Reject reason
              </p>
              <p className="line-clamp-2 text-destructive/75">
                {vacancy.reject_reason}
              </p>
            </div>
          </div>
        )}

        {hasPermission("hr_hiring_vacancy.approve") &&
          vacancy.status === "Pending" && (
            <div className="grid grid-cols-2 gap-2 w-full mt-4">
              <Button
                variant="destructive"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation(); // 👈 Prevent card click
                  dispatch(
                    setDialogData({
                      type: "rejectVacancy",
                      props: vacancy,
                    })
                  );
                }}
              >
                <XIcon />
                Reject
              </Button>

              <Button
                className="bg-green-600 dark:bg-green-700 w-full hover:bg-green-700 dark:hover:bg-green-800"
                onClick={(e) => {
                  e.stopPropagation(); // 👈 Prevent card click
                  handleApprove();
                }}
              >
                <CheckIcon />
                Approve
              </Button>
            </div>
          )}
      </CardContent>
    </Card>
  );
};
