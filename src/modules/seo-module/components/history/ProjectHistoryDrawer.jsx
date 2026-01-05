import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { History } from "lucide-react";

const ProjectHistoryDrawer = ({ historyLogs = [], children }) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        {children || (
          <Button variant="outline">
            <History className="mr-2 h-4 w-4" />
            History Log
          </Button>
        )}
      </DrawerTrigger>

      {/* Wider drawer + full height */}
        <DrawerContent 
            side="right" 
            className="w-full max-w-6xl h-full" 
        >
            <DrawerHeader className="border-b pb-4">
                <DrawerTitle className="text-2xl">Project History Log</DrawerTitle>
                <DrawerDescription>
                Complete audit trail of all project changes
                </DrawerDescription>
            </DrawerHeader>

            <div className="flex-1 overflow-hidden p-6 pt-4">
            {/* Full height ScrollArea with proper inner div */}
            <ScrollArea className="h-full w-full rounded-md border">
                <div className="min-w-[1000px]"> {/* Ensures horizontal scroll if needed */}
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
                        {historyLogs.length > 0 ? (
                            historyLogs.map((log, index) => (
                            <TableRow key={log.id || index}>
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
                                <TableCell className="text-muted-foreground max-w-xs truncate">
                                {log.old_value ?? "-"}
                                </TableCell>
                                <TableCell className="font-medium max-w-xs truncate">
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
            </div>
        </DrawerContent>
    </Drawer>
  );
};

export default ProjectHistoryDrawer;