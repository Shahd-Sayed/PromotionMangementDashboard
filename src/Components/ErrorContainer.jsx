import { RefreshCw } from "lucide-react";
import ErrorAlert from './ErrorAlert';

const ErrorContainer = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 space-y-4">
      <ErrorAlert message={message} />
      <button
        onClick={onRetry}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        <RefreshCw className="w-4 h-4 ml-2" />
        Retry
      </button>
    </div>
  );
};

export default ErrorContainer;
