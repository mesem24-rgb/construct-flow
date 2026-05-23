type PageHeaderProps = {
  title: string;
  description: string;
  actionLabel?: string;
  action?: React.ReactNode;
};

export default function PageHeader({
  title,
  description,
  actionLabel,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-slate-500 dark:text-slate-400">{description}</p>
      </div>

      {action
        ? action
        : actionLabel && (
            <button className="rounded-xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-700">
              {actionLabel}
            </button>
          )}
    </div>
  );
}