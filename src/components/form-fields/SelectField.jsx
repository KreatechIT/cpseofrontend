import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/utils/cn";

export const SelectField = function ({
  options,
  fieldName,
  showLabel = true,
  label,
  value,
  isRequired = true,
  setFieldValue,
  error,
  touched,
  className,
  placeholder = "Select",
  onValueChange = null,
  ...props
}) {
  return (
    <div>
      {showLabel && (
        <Label htmlFor={fieldName} className="gap-0.5 text-sm capitalize">
          {label}
          <span
            className={cn(
              "text-destructive/75 text-sm",
              !isRequired && "opacity-0"
            )}
          >
            *
          </span>
        </Label>
      )}

      <Select
        value={value}
        onValueChange={
          onValueChange
            ? onValueChange
            : (value) => setFieldValue(fieldName, value)
        }
        {...props}
      >
        <SelectTrigger
          id={fieldName}
          name={fieldName}
          aria-invalid={error && touched}
          className={cn(
            "mt-0.5 w-full rounded-md border bg-white p-5 px-3 dark:border-[#dcdcdc]/10 dark:bg-white/5",
            className
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options?.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && touched && (
        <p className="text-destructive mt-1 text-xs">{error}</p>
      )}
    </div>
  );
};
