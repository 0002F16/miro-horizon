/**
 * Visually hidden live region for screen readers. Primary announcements go via speak().
 * This component just renders the current announcement for SR compatibility.
 */
export function LiveRegion({ announcement, className = "" }) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className={`sr-only ${className}`}
      role="status"
    >
      {announcement}
    </div>
  );
}
