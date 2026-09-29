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

  // Statut affiché seulement si une référence a été saisie
  return <span className="text-secondary-400">–</span>;
};

/**
 * Tableau "Référentiel des temps unitaires" : toutes les tâches du catalogue,
 * par ordre de fiabilité décroissante (nombre de relevés).
 * Les tâches jamais saisies (0 relevé) restent visibles, en grisé.
 */
const DashboardPricesTableLayout = ({ rows = [] }) => {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-secondary-500 py-6">
        Aucune tâche dans cette catégorie.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-white">Tâche</TableHead>
          <TableHead className="text-white">Unité</TableHead>
          <TableHead className="text-white text-right">TU moyen</TableHead>
          <TableHead className="text-white text-right">TU min</TableHead>
          <TableHead className="text-white text-right">TU max</TableHead>
          <TableHead className="text-white text-right">
            TU réf. (saisi)
          </TableHead>
          <TableHead className="text-white">Statut</TableHead>
          <TableHead className="text-white text-right">Nb de relevés</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow
            key={row.id}
            className={row.readings === 0 ? "text-secondary-400" : ""}
          >
            <TableCell>{row.task ?? "–"}</TableCell>
            <TableCell>{row.unit ?? "–"}</TableCell>
            <TableCell className="text-right tabular-nums">
              {formatNumber(row.average_unit_time)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatNumber(row.min_unit_time)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatNumber(row.max_unit_time)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatNumber(row.reference_unit_time)}
            </TableCell>
            <TableCell>
              <StatusBadge status={row.status} />
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {row.readings}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DashboardPricesTableLayout;
