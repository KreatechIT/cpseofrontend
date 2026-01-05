import {
  AlertCircleIcon,
  DownloadIcon,
  FileIcon,
  FileSpreadsheetIcon,
  Trash2Icon,
  UploadCloudIcon,
  UploadIcon,
} from "lucide-react";

import { formatBytes, useFileUpload } from "@/hooks/useFileUpload";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect } from "react";

const getFileIcon = (file) => {
  const fileName = file.file instanceof File ? file.file.name : file.file.name;
  const fileType = file.file instanceof File ? file.file.type : file.file.type;

  if (
    fileType.includes("excel") ||
    fileType.includes("spreadsheet") ||
    fileName.endsWith(".xls") ||
    fileName.endsWith(".xlsx")
  ) {
    return <FileSpreadsheetIcon className="size-4 opacity-60" />;
  }

  return <FileIcon className="size-4 opacity-60" />;
};

export default function ExcelUploadField({ onFileChange, initialFiles }) {
  const maxSize = 10 * 1024 * 1024; // 10MB for Excel
  const maxFiles = 1;

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    multiple: false,
    accept:
      ".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    maxFiles,
    maxSize,
    initialFiles,
  });

  // Pass file to parent
  useEffect(() => {
    if (files[0]?.file && onFileChange) {
      onFileChange(files[0].file);
    }
  }, [files, onFileChange]);

  return (
    <div className="flex flex-col gap-2">
      {/* Drop area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-40 flex-col items-center rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px] data-[files]:hidden bg-white dark:bg-white/[3%]"
      >
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload Excel file"
        />
        <div className="flex flex-col items-center justify-center text-center">
          <div
            className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <FileSpreadsheetIcon className="size-4 opacity-60" />
          </div>
          <p className="mb-1.5 text-sm font-medium">Upload Excel File</p>
          <p className="text-muted-foreground text-xs">
            Only .xls and .xlsx ∙ Max {formatBytes(maxSize)}
          </p>
          <Button
            variant="outline"
            type="button"
            className="mt-4"
            onClick={openFileDialog}
          >
            <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
            Select Excel
          </Button>
        </div>
      </div>

      {/* Uploaded File Table */}
      {files.length > 0 && (
        <div className="border rounded-lg p-2 bg-white dark:bg-white/5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium">Uploaded File</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                type="button"
                size="sm"
                onClick={openFileDialog}
              >
                <UploadCloudIcon
                  className="-ms-0.5 size-3.5 opacity-60"
                  aria-hidden="true"
                />
                Replace
              </Button>
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={clearFiles}
              >
                <Trash2Icon
                  className="-ms-0.5 size-3.5 opacity-60"
                  aria-hidden="true"
                />
                Remove
              </Button>
            </div>
          </div>

          <div className="bg-background overflow-hidden rounded-md border mt-2">
            <Table>
              <TableHeader className="text-xs">
                <TableRow className="bg-muted/50">
                  <TableHead className="h-9 py-2">Name</TableHead>
                  <TableHead className="h-9 py-2">Type</TableHead>
                  <TableHead className="h-9 py-2">Size</TableHead>
                  <TableHead className="h-9 w-0 py-2 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-[13px]">
                {files.map((file, idx) => (
                  <TableRow key={file.id || idx}>
                    <TableCell className="max-w-48 py-2 font-medium">
                      <span className="flex items-center gap-2">
                        <span className="shrink-0">{getFileIcon(file)}</span>
                        <span className="truncate">{file.file.name}</span>
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground py-2">
                      {file.file.type.split("/")[1]?.toUpperCase() || "EXCEL"}
                    </TableCell>
                    <TableCell className="text-muted-foreground py-2">
                      {formatBytes(file.file.size)}
                    </TableCell>
                    <TableCell className="py-2 text-right whitespace-nowrap">
                      <Button
                        size="icon"
                        variant="ghost"
                        type="button"
                        className="text-muted-foreground/80 hover:text-foreground size-8 hover:bg-transparent"
                        aria-label={`Remove ${file.file.name}`}
                        onClick={() => removeFile(file.id)}
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  );
}
