const CategoryListSkeleton = () => (
  <section
    aria-busy="true"
    aria-label="Loading category posts"
    className=" px-4 pb-10 md:px-6"
  >
    <span className="sr-only" role="status">
      Loading category posts
    </span>
    <div
      aria-hidden="true"
      className="my-6 grid grid-cols-1 gap-6  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      {[0, 1, 2, 3, 4, 5, 6, 7].map((post) => (
        <div key={post} className="motion-reduce:animate-none animate-pulse">
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
  </section>
);

export default CategoryListSkeleton;
