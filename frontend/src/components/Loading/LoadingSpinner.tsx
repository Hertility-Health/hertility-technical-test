export const LoadingSpinner = () => {
  return (
    <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div
        className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-600"
        role="status"
        aria-label="Loading"
      />
      <p className="mt-4 text-sm font-medium text-slate-600">Loading results...</p>
    </div>
  );
};