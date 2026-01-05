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
import { CalendarDays, Filter } from "lucide-react";

const employeeData = [
  {
    name: "Aiden Clarke",
    date: "2028-03-01",
    role: "Chief Executive Officer",
  },
  {
    name: "Sophia Bennett",
    date: "2028-03-04",
    role: "Chief Executive Officer",
  },
  {
    name: "Liam Foster",
    date: "2028-02-27",
    role: "Chief Executive Officer",
  },
  {
    name: "Emma Hughes",
    date: "2028-02-07",
    role: "Chief Executive Officer",
  },
  {
    name: "Noah Mitchell",
    date: "2028-02-11",
    role: "Chief Executive Officer",
  },
];

export default function EmployeeStatusTable() {
  return (
    <Card className="rounded-xl border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Employee Status</CardTitle>
        <div className="flex items-center gap-2">
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
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto rounded-md border -mt-6">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeeData.map((employee, idx) => (
                <TableRow key={idx}>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>
                    <div>{employee.date}</div>
                  </TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>
                    <div className="flex gap-2 py-1 max-w-40">
                      <Button variant="outline" size="xs">
                        View
                      </Button>
                      <Button variant="outline" size="xs">
                        Edit
                      </Button>
                      <Button variant="destructive" size="xs">
                        Move to Blacklist
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
