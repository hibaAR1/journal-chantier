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

/**
 * Tableau "Comparaison multi-tâches" : une ligne par tâche réalisée par au moins
 * 2 chantiers, une colonne par chantier, TU réel en h/unité ("–" = non réalisée).
 * sites = [{ id, name }] — rows = [{ work_type_id, task, unit, unit_times: { site_id: TU } }]
 */
const DashboardMultiTasksLayout = ({ sites = [], rows = [] }) => {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-secondary-500 py-6">
        Aucune tâche réalisée par au moins 2 chantiers sur la période.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-white">Tâche</TableHead>
          {sites.map((site) => (
            <TableHead key={site.id} className="text-white text-right">
              {site.name}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.work_type_id}>
            <TableCell>
              {row.task ?? "–"} ({row.unit ?? "–"})
            </TableCell>
            {sites.map((site) => (
              <TableCell key={site.id} className="text-right tabular-nums">
                {formatNumber(row.unit_times[site.id])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DashboardMultiTasksLayout;
