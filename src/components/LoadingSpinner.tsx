export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-200 border-solid rounded-full animate-spin">
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-blue-600 border-solid rounded-full animate-spin"></div>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Loading latest articles...
        </p>
      </div>
    </div>
  );
} 