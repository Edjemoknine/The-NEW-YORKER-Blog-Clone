import { forwardRef } from "react";

const MagazineSkeleton = forwardRef<HTMLDivElement>((_, ref) => (
  <div
    ref={ref}
    aria-hidden="true"
    className="mx-auto my-16 grid h-[90vh] min-h-[36rem] max-w-[90rem] animate-pulse grid-rows-2 overflow-hidden bg-muted shadow-sm motion-reduce:animate-none md:grid-cols-2 md:grid-rows-1"
  >
    <div className="flex flex-col items-center justify-center gap-6 px-8 py-10">
      <div className="h-4 w-24 rounded-sm bg-card" />
      <div className="w-full max-w-md space-y-3">
        <div className="h-10 w-full rounded-sm bg-card" />
        <div className="mx-auto h-10 w-4/5 rounded-sm bg-card" />
      </div>
      <div className="w-full max-w-sm space-y-2">
        <div className="h-4 w-full rounded-sm bg-card" />
        <div className="h-4 w-full rounded-sm bg-card" />
        <div className="mx-auto h-4 w-2/3 rounded-sm bg-card" />
      </div>
      <div className="mt-2 h-4 w-32 rounded-sm bg-card" />
    </div>
    <div className="min-h-0 bg-secondary" />
  </div>
));

MagazineSkeleton.displayName = "MagazineSkeleton";

export default MagazineSkeleton;
