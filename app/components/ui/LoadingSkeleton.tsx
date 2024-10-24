export const LoadingSkeleton = () => (
  <div className="space-y-6">
    {/* Search Bar Skeleton */}
    <div className="bg-white rounded-xl shadow-lg p-4">
      <div className="h-14 bg-gray-200 rounded-lg animate-pulse"></div>
    </div>

    {/* Weather Grid Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-gray-200 h-64 rounded-xl animate-pulse"></div>
      </div>
      <div>
        <div className="bg-gray-200 h-64 rounded-xl animate-pulse"></div>
      </div>
    </div>

    {/* Forecast Skeleton */}
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="h-8 bg-gray-200 w-48 rounded animate-pulse mb-4"></div>
      <div className="grid grid-cols-8 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  </div>
);
