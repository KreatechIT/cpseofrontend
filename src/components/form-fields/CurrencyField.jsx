import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrencyInput } from "@/utils/formatCurrency";
import { cn } from "@/utils/cn";
import { useEffect, useRef, useState } from "react";

// Note: Client wanted to show comma separated values while typing.
const CurrencyField = ({
  fieldName,
  label,
  isRequired = true,
  value,
  setFieldValue,
  error,
  touched,
  className,
  ...props
}) => {
  const [displayAmount, setDisplayAmount] = useState("");
  const inputRef = useRef(null);

  // Sync local displayAmount with external Formik value
  useEffect(() => {
    setDisplayAmount(formatCurrencyInput(value));
  }, [value]);

  const handleChange = (e) => {
    const inputEl = inputRef.current;
    const rawInput = e.target.value;
    const caretPos = inputEl.selectionStart;

    // Remove all but numbers and decimal
    const cleaned = rawInput.replace(/[^0-9.]/g, "");

    // Validate decimal structure
    const parts = cleaned.split(".");
    if (parts.length > 2) return;

    // Format integer part
    const formattedInt = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const formatted =
      parts.length === 2 ? `${formattedInt}.${parts[1]}` : formattedInt;

    // Calculate caret offset before formatting
    const charsBeforeCaret = rawInput
      .slice(0, caretPos)
      .replace(/[^0-9.]/g, "");
    let newCaretPos = 0;

    // Format input and restore caret after React renders
    setDisplayAmount(formatted);
    const numericValue = parseFloat(cleaned);
    setFieldValue(fieldName, isNaN(numericValue) ? "" : numericValue);

    requestAnimationFrame(() => {
      // Calculate where the caret should go based on cleaned value
      let currentCleanIndex = 0;
      for (let i = 0; i < formatted.length; i++) {
        if (/[0-9.]/.test(formatted[i])) {
          currentCleanIndex++;
        }
        if (currentCleanIndex === charsBeforeCaret.length) {
          newCaretPos = i + 1;
          break;
        }
      }
      inputEl.setSelectionRange(newCaretPos, newCaretPos);
    });
  };

  return (
    <div>
      <Label htmlFor={fieldName} className="gap-0.5 text-sm capitalize">
        {label}
        {isRequired && <span className="text-destructive/75 text-sm"> *</span>}
      </Label>

      <Input
        ref={inputRef}
        id={fieldName}
        name={fieldName}
        value={displayAmount}
        aria-invalid={error && touched}
        onChange={handleChange}
        className={cn(
          "mt-0.5 rounded-md border bg-white p-5 px-3 dark:border-[#dcdcdc]/10 dark:bg-white/5",
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

export default CurrencyField;
