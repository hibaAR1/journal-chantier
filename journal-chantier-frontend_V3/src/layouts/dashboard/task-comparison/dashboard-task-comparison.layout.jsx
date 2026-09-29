import { Bar } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

/**
 * Diagramme "Comparaison d'une tâche" : TU réel de chaque chantier ayant réalisé
 * la tâche choisie, à côté du TU de référence (s'il est saisi).
 * comparison = { task, unit, reference_unit_time, values: [{ site, unit_time }] }
 */
const DashboardTaskComparisonLayout = ({ comparison }) => {
  if (!comparison || comparison.values.length === 0) {
    return (
      <p className="text-sm text-secondary-500 py-6">
        Aucun chantier n&apos;a réalisé cette tâche sur la période.
      </p>
    );
  }

  const datasets = [
    {
      label: "TU réel",
      data: comparison.values.map((row) => row.unit_time),
      backgroundColor: "#2A63A8",
      maxBarThickness: 40,
    },
  ];

  if (comparison.reference_unit_time !== null) {
    datasets.push({
      label: "TU réf.",
      data: comparison.values.map(() => comparison.reference_unit_time),
      backgroundColor: "#8A887F",
      maxBarThickness: 40,
    });
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", align: "end" },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        beginAtZero: true,
        title: { display: true, text: `h / ${comparison.unit ?? "unité"}` },
      },
    },
  };

  return (
    <div className="h-[280px] w-full">
      <Bar
        data={{ labels: comparison.values.map((row) => row.site), datasets }}
        options={options}
      />
    </div>
  );
};

export default DashboardTaskComparisonLayout;
