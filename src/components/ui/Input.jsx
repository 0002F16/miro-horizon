export function Input({
  className = "",
  type = "text",
  ...props
}) {
  return (
    <input
      type={type}
      className={`font-sans w-full px-4 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${className}`}
      {...props}
    />
  );
}
