const GridSkeleton = () => (
  <div
    aria-hidden="true"
    className="grid sm:grid-cols-2 md:grid-cols-3 my-6 lg:grid-cols-4 gap-6 w-full"
  >
    {[0, 1, 2, 3].map((item) => (
      <div
        key={item}
        className="motion-reduce:animate-none animate-pulse shadow-sm"
      >
        <div className="aspect-[16/10] rounded-sm bg-muted/50" />
        <div className="mt-4 h-3 w-1/4 rounded bg-muted" />
        <div className="mt-3 h-5 w-full rounded bg-muted" />
        <div className="mt-2 h-5 w-4/5 rounded bg-muted" />
        <div className="mt-3 h-4 w-full rounded bg-muted/70" />
        <div className="mt-2 h-4 w-3/4 rounded bg-muted/70" />
        <div className="mt-5 h-8 border-t border-border/20" />
      </div>
    ))}
  </div>
);

export default GridSkeleton;
