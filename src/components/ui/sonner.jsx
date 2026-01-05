import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import { CircleAlertIcon } from "lucide-react";
import { SuccessIcon } from "../icons/Icons";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group text-foreground"
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
      }}
      toastOptions={{
        classNames: {
          toast: "font-sans",
          title: "text-sm ms-2",
          description: "!text-muted-foreground ms-2",
        },
      }}
      icons={{
        success: <SuccessIcon className="me-6 -mt-0.5" aria-hidden="true" />,
        error: (
          <CircleAlertIcon
            className="me-3 -mt-0.5 inline-flex text-destructive"
            size={20}
            aria-hidden="true"
          />
        ),
      }}
      {...props}
    />
  );
};

export { Toaster };
