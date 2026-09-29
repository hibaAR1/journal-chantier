import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table.jsx";

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("fr-FR", { maximumFractionDigits: 1 });

/**
 * Tableau "Heures totales / H.N / H.S / Effectif / % H.S" :
 * compare la charge de travail entre les chantiers actifs sur la période.
 */
const DashboardSitesHoursLayout = ({ rows = [] }) => {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-secondary-500 py-6">
        Aucun chantier actif sur la période.
      </p>
    );
  }

  return (
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
  );
};

export default DashboardSitesHoursLayout;
