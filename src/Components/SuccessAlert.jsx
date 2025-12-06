import { CheckCircle2 } from "lucide-react";

const SuccessAlert = ({ message }) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
      <CheckCircle2 className="w-5 h-5 text-green-600" />
      <p className="text-sm text-green-600">{message}</p>
    </div>
  );
};

export default SuccessAlert;
