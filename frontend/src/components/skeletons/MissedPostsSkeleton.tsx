const MissedPostsSkeleton = () => (
  <div
    aria-hidden="true"
    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 motion-reduce:animate-none animate-pulse"
  >
    {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
      <div key={item} className="h-64 rounded-xl bg-muted/50" />
    ))}
  </div>
);

export default MissedPostsSkeleton;
