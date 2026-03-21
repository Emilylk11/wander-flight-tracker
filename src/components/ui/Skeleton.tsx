export function SkeletonLine({ width = '100%', height = '12px' }: { width?: string; height?: string }) {
  return (
    <div
      className="bg-cream-2 rounded animate-pulse"
      style={{ width, height }}
    />
  );
}

export function SkeletonFlightItem() {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-wborder last:border-b-0">
      <div className="flex-1">
        <SkeletonLine width="60%" height="14px" />
        <div className="mt-2">
          <SkeletonLine width="80%" height="11px" />
        </div>
      </div>
      <div className="text-right">
        <SkeletonLine width="50px" height="15px" />
        <div className="mt-1">
          <SkeletonLine width="70px" height="10px" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div>
      <div className="bg-cream-2 rounded animate-pulse" style={{ height: '120px', width: '100%' }} />
      <div className="flex gap-2.5 mt-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1 bg-cream-2 rounded-lg animate-pulse h-[52px]" />
        ))}
      </div>
    </div>
  );
}
