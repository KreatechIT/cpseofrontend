import { Label } from "@/components/ui/label";
import MultipleSelector from "@/components/ui/multi-select";
import { cn } from "@/utils/cn";

export default function MultiSelectField({
  options,
  name,
  label,
  isRequired = true,
  value,
  handleChange,
  error,
  touched,
  className,
  ...props
}) {
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={name} className="gap-0.5 text-xs uppercase">
        {label}
        {isRequired && <span className="text-destructive/75 text-sm">*</span>}
      </Label>

      <MultipleSelector
        commandProps={{
          label: "Select organisations",
        }}
        className={cn("", className)}
        value={value}
        options={options}
        onChange={handleChange}
        hideClearAllButton
        hidePlaceholderWhenSelected
        emptyIndicator={<p className="text-center text-sm">No results found</p>}
        {...props}
      />
      {error && touched && (
        <p className="text-destructive mt-1 text-xs">{error}</p>
      )}
    </div>
  );
}
