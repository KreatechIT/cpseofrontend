import { Label } from "@/components/ui/label";
import { PasswordInput } from "../ui/password-input";
import { cn } from "@/utils/cn";

const PasswordField = function ({
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
      <Label htmlFor={fieldName} className="gap-0.5 text-xs uppercase">
        {label}
        {isRequired && <span className="text-destructive/75 text-sm">*</span>}
      </Label>
      <PasswordInput
        id={fieldName}
        name={fieldName}
        value={value}
        onChange={handleChange}
        aria-invalid={error && touched}
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

export default PasswordField;
