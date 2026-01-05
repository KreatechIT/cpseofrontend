import { cn } from "@/utils/cn";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const InputField = function ({
  fieldName,
  showLabel = true,
  label,
  isRequired = true,
  value,
  handleChange,
  error,
  touched,
  className,
  labelStyle = "capitalize",
  ...props
}) {
  return (
    <div className="w-full">
      {showLabel && (
        <Label
          htmlFor={fieldName}
          className={cn("gap-0.5 text-sm", labelStyle)}
        >
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
      <Input
        id={fieldName}
        name={fieldName}
        value={value}
        aria-invalid={error && touched}
        onChange={handleChange}
        className={cn(
          "mt-0.5 border bg-white p-5 px-3 dark:border-[#dcdcdc]/10 dark:bg-white/5",
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

export default InputField;
