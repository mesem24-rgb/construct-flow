type PageHeaderProps = {
  title: string;
  description: string;
  actionLabel?: string;
};

export default function PageHeader({
  title,
  description,
  actionLabel,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-slate-500">{description}</p>
      </div>

      {actionLabel && (
        <button className="rounded-xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-700">
          {actionLabel}
        </button>
      )}
    </div>
  );
}