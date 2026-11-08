const UserProfileSkeleton = () => (
  <div
    aria-busy="true"
    aria-label="Loading your profile"
    className="motion-reduce:animate-none animate-pulse space-y-6"
  >
    <div className="h-24 rounded-2xl bg-neutral-200" />
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
      <div className="h-[520px] rounded-2xl bg-neutral-200" />
      <div className="h-64 rounded-2xl bg-neutral-200" />
    </div>
    <span className="sr-only" role="status">
      Loading your profile
    </span>
  </div>
);

export default UserProfileSkeleton;
