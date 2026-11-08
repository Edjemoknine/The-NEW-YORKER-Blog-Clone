const BlogDetailsSkeleton = () => (
  <main
    className="min-h-screen max-w-[90rem] mx-auto px-4 pt-40 py-10 md:px-6"
    aria-busy="true"
    aria-label="Loading post"
  >
    <span className="sr-only" role="status">
      Loading post
    </span>
    <div
      aria-hidden="true"
      className="motion-reduce:animate-none animate-pulse"
    >
      <header className="border-b border-neutral-200 pb-10 md:pb-20">
        <div className="h-4 w-28 rounded bg-neutral-200" />
        <div className="mt-5 h-10 w-full max-w-3xl rounded bg-neutral-200 md:h-14" />
        <div className="mt-3 h-10 w-4/5 max-w-2xl rounded bg-neutral-200 md:h-14" />
        <div className="mt-6 space-y-2">
          <div className="h-5 w-full max-w-4xl rounded bg-neutral-200" />
          <div className="h-5 w-2/3 max-w-3xl rounded bg-neutral-200" />
        </div>
        <div className="mt-5 h-4 w-32 rounded bg-neutral-200" />
      </header>

      <section className="relative mt-10 md:pl-32" aria-label="Loading story">
        <div className="aspect-[16/10] w-full bg-neutral-200 md:w-2/3" />
        <div className="mt-8 max-w-4xl space-y-3">
          {[0, 1, 2, 3, 4, 5].map((line) => (
            <div
              key={line}
              className={`h-5 rounded bg-neutral-200 ${
                line % 3 === 2 ? "w-3/4" : "w-full"
              }`}
            />
          ))}
        </div>
      </section>
    </div>
  </main>
);

export default BlogDetailsSkeleton;
