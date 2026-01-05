import { cn } from "@/utils/cn";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const TextareaField = function ({
  fieldName,
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
    <div>
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
      <Textarea
        id={fieldName}
        name={fieldName}
        value={value}
        aria-invalid={error && touched}
        onChange={handleChange}
        className={cn(
          "mt-0.5 border bg-white dark:border-[#dcdcdc]/10 dark:bg-white/5",
          className
        )}
        {...props}
      />

      {error && touched && (
        <p className="text-destructive mt-1 text-xs">{error}</p>
      )}
    </div>
  );
};

export default TextareaField;
