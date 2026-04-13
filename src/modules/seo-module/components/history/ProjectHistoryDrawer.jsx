import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

const ProjectHistoryDrawer = () => {
  // Get data from Redux store
  const { data } = useSelector((state) => state.sheet);
  const historyLogs = data?.historyLogs || [];
  const projectName = data?.projectName || "Project";
  const loading = data?.loading || false;

  // Transform API response to match the table structure
  const transformedLogs = historyLogs.flatMap((log) => {
    if (log.action === "CREATE") {
      return [{
        id: `${log.timestamp}-create`,
        date: log.timestamp,
        changed_by: log.changed_by,
        field: "Action",
        old_value: "-",
        new_value: log.changes?.message || "Project created"
      }];
    }

    if (log.action === "UPDATE" && log.changes) {
      return Object.entries(log.changes).map(([field, values]) => ({
        id: `${log.timestamp}-${field}`,
        date: log.timestamp,
        changed_by: log.changed_by,
        field: field.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
        old_value: values.old || "-",
        new_value: values.new || "-"
      }));
    }

    // Handle other action types
    return [{
      id: `${log.timestamp}-${log.action}`,
      date: log.timestamp,
      changed_by: log.changed_by,
      field: "Action",
      old_value: "-",
      new_value: log.action
    }];
  });

  return (
    <div className="flex flex-col h-full">
      <div className="border-b pb-4 mb-4">
        <h2 className="text-2xl font-semibold">{projectName} - History Log</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Complete audit trail of all project changes
        </p>
      </div>

      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ScrollArea className="h-full w-full rounded-md border">
            <div className="min-w-[1000px]">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[180px]">Date & Time</TableHead>
                    <TableHead className="w-[200px]">Changed By</TableHead>
                    <TableHead className="w-[180px]">Field</TableHead>
                    <TableHead className="min-w-[200px]">Old Value</TableHead>
                    <TableHead className="min-w-[200px]">New Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transformedLogs.length > 0 ? (
                    transformedLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">
                          {log.date
                            ? format(new Date(log.date), "dd MMM yyyy, HH:mm")
                            : "-"}
                        </TableCell>
                        <TableCell className="font-medium">
                          {log.changed_by || "-"}
                        </TableCell>
                        <TableCell className="font-medium">
                          {log.field || "-"}
                        </TableCell>
                        <TableCell className="text-muted-foreground max-w-xs break-words">
                          {log.old_value ?? "-"}
                        </TableCell>
                        <TableCell className="font-medium max-w-xs break-words">
                          {log.new_value ?? "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-96 text-center text-muted-foreground">
                        No history records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default ProjectHistoryDrawer;