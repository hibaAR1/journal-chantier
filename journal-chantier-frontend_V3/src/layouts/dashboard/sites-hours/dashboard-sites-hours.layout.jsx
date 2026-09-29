import { Bar } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table.jsx";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("fr-FR", { maximumFractionDigits: 1 });

/**
 * Tableau "Heures totales / H.N / H.S / Effectif / % H.S"
 * + diagramme "Heures totales par chantier — H.N vs H.S".
 */
const DashboardSitesHoursLayout = ({ rows = [] }) => {
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
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-white">Chantier</TableHead>
            <TableHead className="text-white text-right">
              Heures totales
            </TableHead>
            <TableHead className="text-white text-right">H.N</TableHead>
            <TableHead className="text-white text-right">H.S</TableHead>
            <TableHead className="text-white text-right">Effectif</TableHead>
            <TableHead className="text-white text-right">% H.S</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.site_id}>
              <TableCell>{row.site}</TableCell>
              <TableCell className="text-right tabular-nums">
                {formatNumber(row.total_hours)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatNumber(row.normal_hours)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatNumber(row.overtime_hours)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {row.workforce}
              </TableCell>
              <TableCell
                className={`text-right tabular-nums ${row.overtime_rate > 10 ? "text-red-700 font-semibold" : ""}`}
              >
                {formatNumber(row.overtime_rate)} %
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="h-[280px] w-full">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default DashboardSitesHoursLayout;
