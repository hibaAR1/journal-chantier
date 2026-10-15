import { useWorkersContext } from "../../../context/workers/workers.context.jsx";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog.jsx";

/**
 * Rapport d'import Excel des ouvriers (CDC V3 § 3.3.3) :
 * lignes ajoutées / mises à jour + détail des erreurs (ligne, matricule, message).
 * S'ouvre automatiquement après un import qui contient des erreurs.
 */
const WorkersImportReportLayout = () => {
  const { importReport, setImportReport } = useWorkersContext();

  const errors = importReport?.errors ?? [];

  return (
    <Dialog
      open={!!importReport}
      onOpenChange={(open) => !open && setImportReport(null)}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-primary-600">
            Rapport d'import
          </DialogTitle>
          <DialogDescription className="text-black">
            Les lignes correctes ont été enregistrées. Corrigez les lignes en
            erreur dans le fichier, puis réimportez-le.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2 text-sm">
          <span className="px-3 py-1 rounded-md bg-green-100 text-green-700 font-semibold">
            {importReport?.created ?? 0} ajouté(s)
          </span>
          <span className="px-3 py-1 rounded-md bg-blue-100 text-blue-700 font-semibold">
            {importReport?.updated ?? 0} mis à jour
          </span>
          <span className="px-3 py-1 rounded-md bg-red-100 text-red-700 font-semibold">
            {errors.length} erreur(s)
          </span>
        </div>

        {errors.length > 0 && (
          <div className="max-h-72 overflow-auto border rounded-md">
            <table className="w-full text-sm">
              <thead className="bg-primary-600 text-white sticky top-0">
                <tr>
                  <th className="px-2 py-1 text-left">Ligne</th>
                  <th className="px-2 py-1 text-left">Matricule</th>
                  <th className="px-2 py-1 text-left">Erreur</th>
                </tr>
              </thead>
              <tbody>
                {errors.map((error, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-2 py-1">{error.line}</td>
                    <td className="px-2 py-1">
                      {error.registration_number || "—"}
                    </td>
                    <td className="px-2 py-1 text-red-700">{error.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WorkersImportReportLayout;
