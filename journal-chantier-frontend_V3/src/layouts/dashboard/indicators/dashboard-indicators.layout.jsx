/**
 * Indicateurs "Heures normales / Heures sup. / Effectif pointé / Tâches achevées".
 */
const formatHours = (value) =>
  `${Number(value || 0).toLocaleString("fr-FR")} h`;

const DashboardIndicatorsLayout = ({ indicators }) => {
  const items = [
    { label: "Heures normales", value: formatHours(indicators?.normal_hours) },
    { label: "Heures sup.", value: formatHours(indicators?.overtime_hours) },
    { label: "Effectif pointé", value: indicators?.workforce ?? 0 },
    {
      label: "Tâches achevées",
      value: `${indicators?.tasks_completed ?? 0} / ${indicators?.tasks_total ?? 0}`,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-md bg-primary-50 border border-primary-100 px-4 py-3"
        >
          <p className="text-xs uppercase tracking-wide text-secondary-500">
            {item.label}
          </p>
          <p className="text-2xl font-semibold text-primary-700 mt-1 tabular-nums">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DashboardIndicatorsLayout;
