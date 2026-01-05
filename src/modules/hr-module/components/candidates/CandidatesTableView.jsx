import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCandidateStatusColor } from "@/utils/getStatusColor";

import { CalendarIcon, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch } from "react-redux";
import { setSheetData } from "@/store/reducers/sheetSlice";
import { Button } from "@/components/ui/button";

const CandidatesTableView = ({ filteredCandidates }) => {
  const dispatch = useDispatch();
  return (
    <div className="overflow-hidden rounded-lg">
      <Table>
        <TableHeader className="border">
          <TableRow>
            <TableHead className="p-3">Candidate</TableHead>
            <TableHead>Applied Role</TableHead>
            <TableHead>Applied Date</TableHead>
            <TableHead>Contact Number</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Nationality</TableHead>

            <TableHead>Status</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredCandidates.map((candidate) => (
            <TableRow key={candidate.id}>
              <TableCell className="pl-3 py-2.5 flex items-center gap-2">
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-10 w-10 rounded-full border border-black/10">
                    <AvatarImage
                      src={candidate.image}
                      alt={candidate.full_name}
                      className="h-full w-full rounded-full object-cover border"
                    />
                    <AvatarFallback className="dark:bg-white/10">
                      <UserIcon
                        size={22}
                        className="opacity-60"
                        aria-hidden="true"
                      />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-medium">{candidate.full_name}</h2>
                    <p className="text-muted-foreground text-sm">
                      {candidate.email}
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell>{candidate?.job_title}</TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="size-4" />
                  {candidate.applied_date}
                </div>
              </TableCell>

              <TableCell>{candidate?.contact_number}</TableCell>
              <TableCell>{candidate?.gender}</TableCell>
              <TableCell>{candidate?.nationality}</TableCell>
              <TableCell>
                <Badge
                  className={`text-xs font-medium px-3 rounded-full ${getCandidateStatusColor(
                    candidate.is_blacklisted ? "Blacklisted" : candidate?.status
                  )}`}
                  variant="outline"
                >
                  {candidate.is_blacklisted ? "Blacklisted" : candidate?.status}
                </Badge>
              </TableCell>

              <TableCell>
                <div className="flex max-w-30">
                  <Button
                    size="xs"
                    variant="outline"
                    className="border-primary/75 dark:border-primary/75 font-normal"
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
              </TableCell>
            </TableRow>
          ))}

          {filteredCandidates.length === 0 && (
            <TableRow>
              <TableCell colSpan={7}>No candidates found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CandidatesTableView;
