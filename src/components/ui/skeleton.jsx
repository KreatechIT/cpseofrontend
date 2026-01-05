import { cn } from "@/utils/cn";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
};

const TableSkeleton = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {[...Array(5)].map((_, i) => (
            <TableHead key={i}>
              <Skeleton className="h-4 w-full max-w-30" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(10)].map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {[...Array(5)].map((_, colIndex) => (
              <TableCell key={colIndex}>
                <Skeleton className="h-7 w-full rounded-xs" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const CardSkeletons = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="p-4 border rounded-lg space-y-3 bg-card">
          <Skeleton className="h-40 w-full" /> {/* Image area */}
          <Skeleton className="h-5 w-3/4" /> {/* Title */}
          <Skeleton className="h-4 w-full" /> {/* Text line 1 */}
          <Skeleton className="h-4 w-5/6" /> {/* Text line 2 */}
        </div>
      ))}
    </div>
  );
};

const FormSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-1/3" /> {/* Label */}
          <Skeleton className="h-10 w-full" /> {/* Input */}
        </div>
      ))}
    </div>
  );
};

export { Skeleton, TableSkeleton, CardSkeletons, FormSkeleton };
