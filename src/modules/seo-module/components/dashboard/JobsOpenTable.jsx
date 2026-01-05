import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { CalendarDays } from "lucide-react";

const jobData = [
  {
    title: "HR Executive",
    department: "Human Resources",
    position: "Mid-Level",
    deadline: "2028-03-01 04:28:48",
    applicants: 20,
  },
  {
    title: "Marketing Manager",
    department: "Marketing",
    position: "Entry-Level",
    deadline: "2028-03-04 04:28:48",
    applicants: 15,
  },
  {
    title: "UI/UX Designer",
    department: "Design",
    position: "Senior",
    deadline: "2028-02-27 04:28:48",
    applicants: 52,
  },
  {
    title: "Backend Developer",
    department: "IT Department",
    position: "Mid-Level",
    deadline: "2028-02-07 04:28:48",
    applicants: 30,
  },
  {
    title: "Frontend Developer",
    department: "IT Department",
    position: "Entry-Level",
    deadline: "2028-02-11 04:28:48",
    applicants: 10,
  },
];

export default function JobsOpenTable() {
  return (
    <Card className="border rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">Jobs Open</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-sm">
              <CalendarDays className="mr-2 h-4 w-4" />
              This Month
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>This Week</DropdownMenuItem>
            <DropdownMenuItem>This Month</DropdownMenuItem>
            <DropdownMenuItem>This Year</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent>
        <div className="overflow-auto rounded-md border -mt-6">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Applicants</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {jobData.map((job, index) => (
                <TableRow key={index}>
                  <TableCell>{job.title}</TableCell>
                  <TableCell className="font-semibold">
                    {job.department}
                  </TableCell>
                  <TableCell>{job.position}</TableCell>
                  <TableCell>{job.deadline}</TableCell>
                  <TableCell className="font-bold">{job.applicants}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="xs">
                        View
                      </Button>
                      <Button variant="outline" size="xs">
                        Edit
                      </Button>
                      <Button variant="destructive" size="xs">
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
