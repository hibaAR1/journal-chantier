import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table.jsx";

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("fr-FR", { maximumFractionDigits: 2 });

// Taux arrondis à l'unité, comme dans le cahier des charges (10%, 25%…)
const formatRate = (value) => `${Math.round(Number(value || 0))}%`;

// "lundi-28/09/2026", comme dans le cahier des charges
const formatDay = (day) =>
  format(parseISO(day), "EEEE-dd/MM/yyyy", { locale: fr });

/**
 * Tableau "État Récapitulatif Journalier de Pointage" (cahier des charges § 3.1.2) :
 * une ligne par chantier + ligne TOTAL, détail par métier (MOD puis MOI).
 * summary = { trades: { mod: [...], moi: [...] }, rows: [...], total: {...} }
 */
const PunchSummaryTableLayout = ({ summary }) => {
  const { trades, rows, total } = summary;

  // Colonnes chiffrées communes à chaque ligne et à la ligne TOTAL
  const cells = (line) => (
    <>
      <TableCell className="text-right tabular-nums">
        {formatNumber(line.normal_hours)}
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {formatNumber(line.overtime_hours)}
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {formatNumber(line.total_hours)}
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {formatRate(line.overtime_rate)}
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {line.workforce}
      </TableCell>
      <TableCell className="text-right tabular-nums">{line.mod}</TableCell>
      <TableCell className="text-right tabular-nums">{line.moi}</TableCell>
      <TableCell className="text-right tabular-nums">
        {formatRate(line.moi_rate)}
      </TableCell>
      {trades.mod.map((trade) => (
        <TableCell key={`mod-${trade}`} className="text-center tabular-nums">
          {line.mod_detail[trade]}
        </TableCell>
      ))}
      {trades.moi.map((trade) => (
        <TableCell key={`moi-${trade}`} className="text-center tabular-nums">
          {line.moi_detail[trade]}
        </TableCell>
      ))}
    </>
  );

  // En-tête de métier écrit à la verticale (beaucoup de colonnes)
  const tradeHead = (trade) => (
    <TableHead key={trade} className="h-36 px-1 text-center align-bottom">
      <span className="inline-block [writing-mode:vertical-rl] rotate-180 whitespace-nowrap text-xs">
        {trade}
      </span>
    </TableHead>
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead rowSpan={2}>Chantier</TableHead>
          <TableHead rowSpan={2}>Date</TableHead>
          <TableHead rowSpan={2}>Chef Chantier</TableHead>
          <TableHead rowSpan={2} className="text-right">
            Heures normales (HN)
          </TableHead>
          <TableHead rowSpan={2} className="text-right">
            Heures sup. (HS)
          </TableHead>
          <TableHead rowSpan={2} className="text-right">
            Total heures (HT)
          </TableHead>
          <TableHead rowSpan={2} className="text-right">
            Taux HS / HT
          </TableHead>
          <TableHead rowSpan={2} className="text-right">
            Effectif total
          </TableHead>
          <TableHead rowSpan={2} className="text-right">
            MOD
          </TableHead>
          <TableHead rowSpan={2} className="text-right">
            MOI
          </TableHead>
          <TableHead rowSpan={2} className="text-right">
            Taux MOI / Effectif
          </TableHead>
          <TableHead colSpan={trades.mod.length} className="text-center">
            Main d&apos;oeuvre directe
          </TableHead>
          <TableHead colSpan={trades.moi.length} className="text-center">
            Main d&apos;oeuvre indirecte
          </TableHead>
        </TableRow>
        <TableRow>
          {trades.mod.map(tradeHead)}
          {trades.moi.map(tradeHead)}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.site_id}>
            <TableCell className="font-semibold whitespace-nowrap">
              {row.site}
            </TableCell>
            <TableCell className="whitespace-nowrap">
              {formatDay(row.date)}
            </TableCell>
            <TableCell className="whitespace-nowrap">
              {row.site_manager ?? "–"}
            </TableCell>
            {cells(row)}
          </TableRow>
        ))}

        {/* Ligne TOTAL de consolidation */}
        <TableRow className="bg-primary-50 font-bold">
          <TableCell colSpan={3} className="text-center">
            TOTAL
          </TableCell>
          {cells(total)}
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default PunchSummaryTableLayout;
