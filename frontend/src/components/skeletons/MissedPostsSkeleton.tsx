const MissedPostsSkeleton = () => (
  <div
    aria-hidden="true"
    className="grid animate-pulse grid-cols-1 gap-6 motion-reduce:animate-none sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
  >
    {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
      <div
        key={item}
        className="h-64 rounded-sm border border-border bg-muted/50 shadow-sm"
      />
    ))}
  </div>
);

export default MissedPostsSkeleton;
