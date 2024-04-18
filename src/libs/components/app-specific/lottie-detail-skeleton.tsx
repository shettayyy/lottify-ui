export const LottieDetailSkeleton = () => {
  return (
    <div className="container flex flex-col items-center space-y-16 p-4">
      <div className="flex w-1/2 animate-pulse flex-col items-center">
        <div className="h-8 w-1/2 rounded bg-neutral-800" />
        <div className="mt-2 h-4 w-1/4 rounded bg-neutral-800" />
      </div>

      <div className="relative h-60 w-1/2 animate-pulse overflow-hidden rounded md:h-96">
        <div className="absolute inset-0 bg-neutral-800" />
      </div>

      <div className="flex w-1/2 animate-pulse flex-col items-center">
        <div className="h-4 w-1/2 rounded bg-neutral-800" />
        <div className="mt-4 h-8 w-full rounded bg-neutral-800" />
      </div>
    </div>
  );
};
