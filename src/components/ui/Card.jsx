export function Card({ className = "", children, ...props }) {
  return (
    <div
      className={`rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 font-sans ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
