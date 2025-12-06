import { CheckCircle2, AlertCircle, X } from "lucide-react";

const ToastAlert = ({ type = "success", message, onClose }) => {
  const isSuccess = type === "success";

  return (
    <div
      className={`fixed top-6 right-6 z-50 min-w-[320px] max-w-[420px] 
      bg-white border rounded-xl shadow-lg overflow-hidden animate-slide-in
      ${isSuccess ? "border-green-300" : "border-red-300"}`}
    >
      <div className="flex items-center gap-3 p-4">
        {isSuccess ? (
          <CheckCircle2 className="text-green-500 w-6 h-6" />
        ) : (
          <AlertCircle className="text-red-500 w-6 h-6" />
        )}

        <p className="flex-1 text-sm font-medium text-gray-800">
          {message}
        </p>

        <button onClick={onClose}>
          <X className="w-4 h-4 text-gray-500 hover:text-black" />
        </button>
      </div>

      <div
        className={`h-[3px] w-full animate-progress 
        ${isSuccess ? "bg-green-500" : "bg-red-500"}`}
      />
    </div>
  );
};

export default ToastAlert;
