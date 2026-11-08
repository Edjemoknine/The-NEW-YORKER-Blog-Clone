const RecommendationsSkeleton = () => (
  <div
    aria-busy="true"
    aria-label="Loading recommendations"
    className="max-w-[90rem] mx-auto px-4 pb-12 md:px-6 my-6"
  >
    <span className="sr-only" role="status">
      Loading recommendations
    </span>
    <div
      aria-hidden="true"
      className="motion-reduce:animate-none animate-pulse"
    >
      <div className="mb-6 h-7 w-52 rounded-md bg-muted" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[0, 1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-[340px] rounded-xl border border-border/40 bg-muted/50 p-4"
          />
        ))}
      </div>
    </div>
  </div>
);

export default RecommendationsSkeleton;
