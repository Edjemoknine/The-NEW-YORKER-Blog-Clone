const ProfileSkeleton = () => (
  <main
    className="min-h-screen max-w-[90rem] mx-auto px-4 py-10 pt-40 md:px-6"
    aria-busy="true"
    aria-label="Loading profile"
  >
    <span className="sr-only" role="status">
      Loading profile
    </span>
    <div
      aria-hidden="true"
      className="motion-reduce:animate-none animate-pulse"
    >
      <section className="flex flex-col items-center gap-6 border-b border-neutral-200 pb-16 md:flex-row md:items-start">
        <div className="h-52 w-52 shrink-0 rounded-full bg-neutral-200" />
        <div className="w-full flex-1 space-y-4 pt-2">
          <div className="h-12 w-3/4 max-w-md rounded bg-neutral-200" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-neutral-200" />
            <div className="h-4 w-full rounded bg-neutral-200" />
            <div className="h-4 w-5/6 rounded bg-neutral-200" />
            <div className="h-4 w-2/3 rounded bg-neutral-200" />
          </div>
        </div>
      </section>

      <section className="max-w-5xl" aria-label="Loading profile posts">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="flex h-72 gap-10 border-b border-neutral-200 py-6"
          >
            <div className="flex flex-[2] flex-col gap-4">
              <div className="h-3 w-24 rounded bg-neutral-200" />
              <div className="h-6 w-4/5 rounded bg-neutral-200" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-neutral-200" />
                <div className="h-4 w-5/6 rounded bg-neutral-200" />
                <div className="h-4 w-2/3 rounded bg-neutral-200" />
              </div>
              <div className="mt-auto h-4 w-28 rounded bg-neutral-200" />
            </div>
            <div className="hidden flex-1 rounded bg-neutral-200 md:block" />
          </div>
        ))}
      </section>
    </div>
  </main>
);

export default ProfileSkeleton;
