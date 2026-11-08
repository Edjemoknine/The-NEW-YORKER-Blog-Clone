const RecommendationsSkeleton = () => (
  <div
    aria-busy="true"
    aria-label="Loading recommendations"
    className="mx-auto my-6 max-w-[90rem] px-4 pb-12 md:px-6"
  >
    <span className="sr-only" role="status">
      Loading recommendations
    </span>
    <div
      aria-hidden="true"
      className="motion-reduce:animate-none animate-pulse"
    >
      <div className="mb-6 h-7 w-52 rounded-sm bg-muted" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-[340px] rounded-sm border border-border bg-muted/50 p-4 shadow-sm"
          />
        ))}
      </div>
    </div>
  </div>
);

export default RecommendationsSkeleton;
