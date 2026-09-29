import { Bar } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("fr-FR", { maximumFractionDigits: 2 });

/**
 * Diagramme + tableau "Quantité totale par tâche" sur la période.
 */
const DashboardTaskTotalsLayout = ({ rows = [] }) => {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-secondary-500 py-6">
        Aucune tâche saisie sur la période.
      </p>
    );
  }

  const data = {
    labels: rows.map((row) => `${row.task ?? "–"} (${row.unit ?? "–"})`),
    datasets: [
      {
        label: "Quantité totale",
        data: rows.map((row) => row.quantity),
        backgroundColor: "#C94D25",
        maxBarThickness: 24,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { beginAtZero: true },
      y: { grid: { display: false } },
    },
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        className="w-full"
        style={{ height: `${Math.max(160, rows.length * 36)}px` }}
      >
        <Bar data={data} options={options} />
      </div>

      <h4 className="font-semibold">Tableau des tâches — quantité totale</h4>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-white">Tâche</TableHead>
            <TableHead className="text-white">Unité</TableHead>
            <TableHead className="text-white text-right">
              Quantité totale
            </TableHead>
            <TableHead className="text-white text-right">
              Nb de lignes
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={`${row.task}-${row.unit}`}>
              <TableCell>{row.task ?? "–"}</TableCell>
              <TableCell>{row.unit ?? "–"}</TableCell>
              <TableCell className="text-right tabular-nums">
                {formatNumber(row.quantity)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {row.lines}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DashboardTaskTotalsLayout;
