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

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("fr-FR", { maximumFractionDigits: 1 });

/**
 * Petit plugin Chart.js : écrit le total (H.N + H.S) au-dessus de chaque barre,
 * comme dans le cahier des charges (342, 116, 318…).
 */
const totalLabelsPlugin = {
  id: "totalLabels",
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    const lastMeta = chart.getDatasetMeta(chart.data.datasets.length - 1);

    ctx.save();
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#374151";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";

    lastMeta.data.forEach((bar, index) => {
      const total = chart.data.datasets.reduce(
        (sum, dataset) => sum + (Number(dataset.data[index]) || 0),
        0,
      );
      ctx.fillText(formatNumber(total), bar.x, bar.y - 4);
    });

    ctx.restore();
  },
};

/**
 * Diagramme "Heures totales par chantier — H.N vs H.S" :
 * version visuelle du tableau, H.N empilé avec H.S.
 */
const DashboardSitesHoursChartLayout = ({ rows = [] }) => {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-secondary-500 py-6">
        Aucun chantier actif sur la période.
      </p>
    );
  }

  const data = {
    labels: rows.map((row) => row.site),
    datasets: [
      {
        label: "H.N",
        data: rows.map((row) => row.normal_hours),
        backgroundColor: "#C94D25",
        maxBarThickness: 48,
      },
      {
        label: "H.S",
        data: rows.map((row) => row.overtime_hours),
        backgroundColor: "#6c2c22",
        maxBarThickness: 48,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { top: 20 } },
    plugins: {
      legend: { position: "top", align: "end" },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { stacked: true, grid: { display: false } },
      // grace : un peu de place au-dessus de la plus haute barre pour afficher son total
      y: { stacked: true, beginAtZero: true, grace: "12%" },
    },
  };

  return (
    <div className="h-[280px] w-full">
      <Bar data={data} options={options} plugins={[totalLabelsPlugin]} />
    </div>
  );
};

export default DashboardSitesHoursChartLayout;
