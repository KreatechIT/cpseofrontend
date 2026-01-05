import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { setSheetData } from "@/store/reducers/sheetSlice";
import { getCandidateStatusColor } from "@/utils/getStatusColor";
import { format } from "date-fns";
import { MailIcon, PhoneCallIcon, UserIcon } from "lucide-react";
import { useDispatch } from "react-redux";

const CandidateCardView = ({ filteredCandidates }) => {
  return (
    <div className="@8xl:grid-cols-4 grid grid-cols-1 gap-4 @2xl:grid-cols-2 @5xl:grid-cols-3">
      {filteredCandidates.map((org) => (
        <CandidateCard key={org.id} candidate={org} />
      ))}

      {filteredCandidates.length === 0 && <p>No candidates found</p>}
    </div>
  );
};

export default CandidateCardView;

const CandidateCard = ({ candidate }) => {
  const dispatch = useDispatch();

  return (
    <Card className="flex flex-col justify-between overflow-hidden rounded-xl py-3">
      <CardHeader className="flex flex-wrap items-start justify-between gap-4 px-2">
        <div className="flex flex-1 min-w-0 items-start gap-2.5">
          <Avatar className="h-20 w-20 rounded-lg border">
            <AvatarImage
              src={candidate.image}
              alt={candidate.full_name}
              className="h-full w-full rounded-lg object-cover border"
            />
            <AvatarFallback className="dark:bg-white/10 rounded-lg">
              <UserIcon size={40} className="opacity-60" aria-hidden="true" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 w-full">
            <div className="flex justify-between w-full">
              <h2 className="font-medium break-words whitespace-normal">
                {candidate.full_name}
              </h2>
              <div className="shrink-0">
                <Badge
                  className={`text-xs font-medium px-3 rounded-full ${getCandidateStatusColor(
                    candidate.is_blacklisted ? "Blacklisted" : candidate?.status
                  )}`}
                  variant="outline"
                >
                  {candidate.is_blacklisted ? "Blacklisted" : candidate?.status}
                </Badge>
              </div>
            </div>
            <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-1 break-all">
              <MailIcon size={16} />
              {candidate.email}
            </p>
            <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-1 break-all">
              <PhoneCallIcon size={16} />
              {candidate.contact_number}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="-mt-2 text-sm space-y-1.5 border mx-3 rounded-md py-2 px-2 bg-primary/5">
        <div className="grid grid-cols-[120px_1fr]">
          <span className="text-muted-foreground">Applied Date:</span>
          <span>{format(candidate.applied_date, "PP")}</span>
        </div>

        <div className="grid grid-cols-[120px_1fr]">
          <span className="text-muted-foreground">Applied Role:</span>
          <span>{candidate.job_title}</span>
        </div>

        <div className="grid grid-cols-[120px_1fr]">
          <span className="text-muted-foreground">Gender:</span>
          <span>{candidate.gender}</span>
        </div>

        <div className="grid grid-cols-[120px_1fr]">
          <span className="text-muted-foreground">Nationality:</span>
          <span>{candidate.nationality}</span>
        </div>
      </CardContent>

      <CardFooter className="-mt-1.5 px-3.5">
        <div className="w-full">
          <Button
            size="sm"
            variant="outline"
            className="border-primary/75 dark:border-primary/75 font-normal w-full"
            onClick={() =>
              dispatch(
                setSheetData({
                  type: "candidateDetails",
                  props: candidate,
                })
              )
            }
          >
            View Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
