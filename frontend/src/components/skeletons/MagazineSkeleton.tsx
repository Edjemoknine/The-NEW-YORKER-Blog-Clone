import { forwardRef } from "react";

const MagazineSkeleton = forwardRef<HTMLDivElement>((_, ref) => (
  <div
    ref={ref}
    aria-hidden="true"
    className="max-w-[90rem] h-[90vh] min-h-[36rem] my-16 mx-auto grid grid-rows-2 overflow-hidden bg-neutral-300 shadow shadow-black/5 motion-reduce:animate-none animate-pulse md:grid-rows-1 md:grid-cols-2"
  >
    <div className="flex flex-col items-center justify-center gap-6 px-8 py-10">
      <div className="h-4 w-24 rounded bg-neutral-100" />
      <div className="w-full max-w-md space-y-3">
        <div className="h-10 w-full rounded bg-neutral-100" />
        <div className="mx-auto h-10 w-4/5 rounded bg-neutral-100" />
      </div>
      <div className="w-full max-w-sm space-y-2">
        <div className="h-4 w-full rounded bg-neutral-100" />
        <div className="h-4 w-full rounded bg-neutral-100" />
        <div className="mx-auto h-4 w-2/3 rounded bg-neutral-100" />
      </div>
      <div className="mt-2 h-4 w-32 rounded bg-neutral-100" />
    </div>
    <div className="min-h-0 bg-neutral-100 " />
  </div>
));

MagazineSkeleton.displayName = "MagazineSkeleton";

export default MagazineSkeleton;
