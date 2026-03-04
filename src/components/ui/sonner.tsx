import { Toaster as Sonner, toast as sonnerToast } from "sonner";
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";
import { createElement } from "react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          closeButton: "group-[.toast]:text-foreground/50",
        },
      }}
      {...props}
    />
  );
};

// Custom toast helpers
const toast = {
  success: (title: string, description?: string) => {
    sonnerToast.success(title, {
      description,
      icon: createElement(CheckCircle, { className: "h-5 w-5 text-green-500" }),
    });
  },
  error: (title: string, description?: string) => {
    sonnerToast.error(title, {
      description,
      icon: createElement(XCircle, { className: "h-5 w-5 text-red-500" }),
    });
  },
  info: (title: string, description?: string) => {
    sonnerToast.info(title, {
      description,
      icon: createElement(Info, { className: "h-5 w-5 text-blue-500" }),
    });
  },
  warning: (title: string, description?: string) => {
    sonnerToast.warning(title, {
      description,
      icon: createElement(AlertTriangle, { className: "h-5 w-5 text-yellow-500" }),
    });
  },
  loading: (title: string, description?: string) => {
    return sonnerToast.loading(title, { description });
  },
  dismiss: (id?: string | number) => {
    sonnerToast.dismiss(id);
  },
  promise: sonnerToast.promise,
  custom: sonnerToast,
};

export { Toaster, toast };
