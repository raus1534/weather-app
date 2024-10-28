export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-12 bg-gray-200 rounded-xl"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-64 bg-gray-200 rounded-xl"></div>
        <div className="h-64 bg-gray-200 rounded-xl"></div>
      </div>
      <div className="h-48 bg-gray-200 rounded-xl"></div>
      <div className="h-96 bg-gray-200 rounded-xl"></div>
    </div>
  );
};
