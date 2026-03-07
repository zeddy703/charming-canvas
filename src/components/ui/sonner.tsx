import { Toaster as Sonner, toast as sonnerToast } from "sonner";
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";
import { createElement } from "react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light" // or "dark" / "system" — adjust as needed
      className="toaster group"
      position="top-right"
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        classNames: {
          // Base (minimal – avoid forcing bg here)
          toast:
            "group toast pointer-events-auto flex w-full items-center gap-3 rounded-lg border p-4 shadow-lg",

          // Variant backgrounds – use ! to override Sonner defaults
          success: "!bg-green-50 border-green-300 text-green-900 [&>svg]:text-green-600",
          error:   "!bg-red-50 border-red-300 text-red-900 [&>svg]:text-red-600",
          warning: "!bg-yellow-50 border-yellow-300 text-yellow-900 [&>svg]:text-yellow-600",
          info:    "!bg-blue-50 border-blue-300 text-blue-900 [&>svg]:text-blue-600",
          default: "!bg-gray-50 border-gray-200 text-gray-900",
          loading: "!bg-gray-50 border-gray-200 text-gray-800 animate-pulse",

          // Keep your other styles (with group- if needed)
          description: "group-[.toast]:text-muted-foreground text-sm mt-1",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground hover:bg-primary/90",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground hover:bg-muted/80",
          closeButton:
            "group-[.toast]:text-foreground/50 hover:text-foreground/80 absolute right-2 top-2",
        },
      }}
      {...props}
    />
  );
};

// Your custom toast helpers (icons match the colors now)
const toast = {
  success: (title: string, description?: string) => {
    sonnerToast.success(title, {
      description,
      icon: createElement(CheckCircle, { className: "h-5 w-5 text-green-600" }),
    });
  },
  error: (title: string, description?: string) => {
    sonnerToast.error(title, {
      description,
      icon: createElement(XCircle, { className: "h-5 w-5 text-red-600" }),
    });
  },
  info: (title: string, description?: string) => {
    sonnerToast.info(title, {
      description,
      icon: createElement(Info, { className: "h-5 w-5 text-blue-600" }),
    });
  },
  warning: (title: string, description?: string) => {
    sonnerToast.warning(title, {
      description,
      icon: createElement(AlertTriangle, { className: "h-5 w-5 text-yellow-600" }),
    });
  },
  loading: (title: string, description?: string) => {
    return sonnerToast.loading(title, { description });
  },
  dismiss: sonnerToast.dismiss,
  promise: sonnerToast.promise,
  //update: sonnerToast.update, // useful for promise/loading flows
};

export { Toaster, toast };