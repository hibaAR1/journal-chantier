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

const COLORS = {
  qualified: "#C94D25", // primary-600
  labour: "#e8ae89", // primary-300
};

/**
 * Diagramme "Effectif par catégorie de travaux" (qualifiés / main d'oeuvre).
 */
const DashboardWorkforceChartLayout = ({ rows = [] }) => {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-secondary-500 py-6">
        Aucun effectif affecté aux tâches ce jour-là.
      </p>
    );
  }

  const data = {
    labels: rows.map((row) => row.category),
    datasets: [
      {
        label: "Qualifiés",
        data: rows.map((row) => row.qualified),
        backgroundColor: COLORS.qualified,
        borderRadius: 4,
        maxBarThickness: 32,
      },
      {
        label: "Main d'oeuvre",
        data: rows.map((row) => row.labour),
        backgroundColor: COLORS.labour,
        borderRadius: 4,
        maxBarThickness: 32,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", align: "end" },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { precision: 0 } },
    },
  };

  return (
    <div className="h-[300px] w-full">
      <Bar data={data} options={options} />
    </div>
  );
};

export default DashboardWorkforceChartLayout;
