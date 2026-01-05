import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { format } from "date-fns";

const SearchConsoleImportTable = ({ data, columns }) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No data to preview</p>;
  }

  return (
    <ScrollArea className="rounded-md border h-[calc(100vh-220px)]">
      <Table>
        <TableHeader className="sticky top-0 bg-white z-10">
          <TableRow>
            <TableHead className="w-[50px]">No</TableHead>
            {columns.map((col, index) => (
              <TableHead key={index}>{col}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                {columns.map((col, colIndex) => (
                  <TableCell key={colIndex}>{row[col] || "-"}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="h-24 text-center text-muted-foreground">
                No data found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default SearchConsoleImportTable;