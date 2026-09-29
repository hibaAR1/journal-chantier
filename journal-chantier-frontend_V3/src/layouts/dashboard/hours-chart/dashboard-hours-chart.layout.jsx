import { Bar } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { format, parseISO } from "date-fns";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

/**
 * "Heures normales vs heures sup. par jour" : H.N et H.S empilées pour chaque jour,
 * afin de repérer les journées avec dépassement d'horaire.
 */
const DashboardHoursChartLayout = ({ rows = [] }) => {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-secondary-500 py-6">
        Aucune heure saisie sur la période.
      </p>
    );
  }

  const data = {
    labels: rows.map((row) => format(parseISO(row.date), "dd/MM")),
    datasets: [
      {
        label: "H.N",
        data: rows.map((row) => row.normal_hours),
        backgroundColor: "#C94D25",
        maxBarThickness: 40,
      },
      {
        label: "H.S",
        data: rows.map((row) => row.overtime_hours),
        backgroundColor: "#6c2c22",
        maxBarThickness: 40,
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
      x: { stacked: true, grid: { display: false } },
      y: { stacked: true, beginAtZero: true },
    },
  };

  return (
    <div className="h-[280px] w-full">
      <Bar data={data} options={options} />
    </div>
  );
};

export default DashboardHoursChartLayout;
