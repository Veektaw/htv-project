import { toast } from "sonner";

type ToastType = "success" | "error" | "warning" | "info";

const toastStyles = {
  success: {
    color: "#fff",
    background: "#10B981",
    border: "1px solid #10B981",
  },
  error: {
    color: "#fff",
    background: "#EF4444",
    border: "1px solid #EF4444",
  },
  warning: {
    color: "#fff",
    background: "#F59E0B",
    border: "1px solid #F59E0B",
  },
  info: {
    color: "#fff",
    background: "#3B82F6",
    border: "1px solid #3B82F6",
  },
};

export const showToast = (message: string, type: ToastType = "success") => {
  toast[type](message, {
    style: toastStyles[type],
  });
};

// Convenience functions for each toast type
export const showSuccessToast = (message: string) =>
  showToast(message, "success");
export const showErrorToast = (message: string) => showToast(message, "error");
export const showWarningToast = (message: string) =>
  showToast(message, "warning");
export const showInfoToast = (message: string) => showToast(message, "info");
