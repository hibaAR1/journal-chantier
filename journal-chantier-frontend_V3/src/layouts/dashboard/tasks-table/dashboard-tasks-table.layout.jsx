import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table.jsx";

const formatNumber = (value) =>
  value === null || value === undefined
    ? "–"
    : Number(value).toLocaleString("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

const StatusBadge = ({ status }) => {
  if (status === "above") {
    return (
      <span className="inline-block rounded px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800">
        Au-dessus de la réf.
      </span>
    );
  }

  if (status === "ok") {
    return (
      <span className="inline-block rounded px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800">
        Conforme
      </span>
    );
  }

  // Pas de TU de référence saisi → "–" et aucun badge
  return <span className="text-secondary-400">–</span>;
};

/**
 * Tableau "Rendement par tâche" (les plus faibles en premier).
 */
const DashboardTasksTableLayout = ({ tasks = [] }) => {
  if (tasks.length === 0) {
    return (
      <p className="text-sm text-secondary-500 py-6">
        Aucune tâche saisie dans ce journal.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-white">Tâche</TableHead>
          <TableHead className="text-white">Bloc</TableHead>
          <TableHead className="text-white">Unité</TableHead>
          <TableHead className="text-white text-right">TU</TableHead>
          <TableHead className="text-white text-right">TU réf.</TableHead>
          <TableHead className="text-white text-right">Rendement</TableHead>
          <TableHead className="text-white">Statut</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell>{task.task ?? "–"}</TableCell>
            <TableCell>{task.block ?? "–"}</TableCell>
            <TableCell>{task.unit ?? "–"}</TableCell>
            <TableCell
              className={`text-right tabular-nums ${task.status === "above" ? "text-red-700 font-semibold" : ""}`}
            >
              {formatNumber(task.unit_time)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatNumber(task.reference_unit_time)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatNumber(task.performance)}
            </TableCell>
            <TableCell>
              <StatusBadge status={task.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DashboardTasksTableLayout;
