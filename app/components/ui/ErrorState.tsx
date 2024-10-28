interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="text-center py-12">
      <div className="text-red-500 text-xl mb-4">{message}</div>
      <button
        onClick={onRetry}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Retry
      </button>
    </div>
  );
};
