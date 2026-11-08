const UserProfileSkeleton = () => (
  <div aria-busy="true" aria-label="Loading your profile">
    <span className="sr-only" role="status">
      Loading your profile
    </span>
    <div
      aria-hidden="true"
      className="motion-reduce:animate-none animate-pulse"
    >
      <header className="mb-8 space-y-3">
        <div className="h-3 w-24 rounded bg-neutral-200" />
        <div className="h-9 w-64 max-w-full rounded bg-neutral-200" />
        <div className="h-4 w-full max-w-lg rounded bg-neutral-200" />
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-4 border-b border-neutral-100 pb-6 sm:flex-row sm:items-center">
            <div className="size-[76px] shrink-0 rounded-2xl bg-neutral-200" />
            <div className="flex-1 space-y-3">
              <div className="h-3 w-24 rounded bg-neutral-200" />
              <div className="h-6 w-48 max-w-full rounded bg-neutral-200" />
            </div>
            <div className="h-10 w-32 rounded-xl bg-neutral-200" />
          </div>

          <div className="mt-6 space-y-5">
            <div className="space-y-2">
              <div className="h-3 w-20 rounded bg-neutral-200" />
              <div className="h-11 rounded-xl bg-neutral-100" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-16 rounded bg-neutral-200" />
              <div className="h-28 rounded-xl bg-neutral-100" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-28 rounded bg-neutral-200" />
              <div className="h-11 rounded-xl bg-neutral-100" />
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="rounded-2xl bg-[#202b42] p-6">
            <div className="size-10 rounded-lg bg-white/10" />
            <div className="mt-7 h-4 w-28 rounded bg-white/20" />
            <div className="mt-2 h-9 w-16 rounded bg-white/20" />
            <div className="mt-3 h-3 w-40 max-w-full rounded bg-white/10" />
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="h-4 w-24 rounded bg-neutral-200" />
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="h-20 rounded-xl bg-neutral-100" />
              <div className="h-20 rounded-xl bg-neutral-100" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
);

export default UserProfileSkeleton;
