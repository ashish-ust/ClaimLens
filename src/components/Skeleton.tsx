import './Skeleton.css';

interface Props {
  height?: string;
  width?: string;
  className?: string;
}

/** A single shimmering placeholder block. */
export function Skeleton({ height = '1rem', width = '100%', className }: Props) {
  return <div className={`skeleton ${className ?? ''}`.trim()} style={{ height, width }} aria-hidden="true" />;
}

/** Placeholder layout shown while a page is loading. */
export function PageSkeleton({ label, cards = 3 }: { label: string; cards?: number }) {
  return (
    <div role="status" aria-live="polite" className="stack">
      <span className="visually-hidden">{label}</span>
      <div className="card stack">
        <Skeleton height="1.2rem" width="30%" />
        <Skeleton height="2.2rem" width="55%" />
        <Skeleton height="0.9rem" />
        <Skeleton height="0.9rem" width="80%" />
      </div>
      <div className="skeleton-grid">
        {Array.from({ length: cards }, (_, i) => (
          <div className="card stack" key={i}>
            <Skeleton height="1.1rem" width="50%" />
            <Skeleton height="1.6rem" width="40%" />
            <Skeleton height="0.9rem" />
            <Skeleton height="0.9rem" width="70%" />
          </div>
        ))}
      </div>
    </div>
  );
}
