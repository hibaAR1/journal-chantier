import { createContext, useContext, useState } from "react";

import ReportsApis from "../../apis/reports.apis.jsx";
import SitesApis from "../../apis/sites.apis.jsx";

import { useToast } from "../../hooks/use-toast.js";

const ReportsContext = createContext({
  reports: {},
  getReports: () => {},
  sites: {},
  getSites: () => {},
  addReport: () => {},
  updateReport: () => {},
  deleteReport: () => {},
  downloadReportPDF: () => {},
  downloadReportExcel: () => {},
});

export const ReportsProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [sites, setSites] = useState([]);

  const { toast } = useToast();

  const getReports = async () => {
    await ReportsApis.getReports()
      .then(({ data }) => {
        setReports(Array.isArray(data) ? data : (data?.data ?? []));
      })
      .catch((error) => console.warn(error));
  };

  const getSites = async () => {
    await SitesApis.getSites()
      .then(({ data }) => {
        setSites(
          data.map((site) => {
            return {
              value: site.id,
              label: site.name,
            };
          }),
        );
      })
      .catch((error) => console.warn(error));
  };

  const addReport = async (values, form) => {
    const { setError, reset } = form;

    return await ReportsApis.create(values)
      .then((response) => {
        if (response.status === 201) {
          setReports([...reports, response.data.report]);

          toast({
            variant: "success",
            title: "Ajout réussi",
            description: `Journal "${response.data.report.code}" a été ajouté avec succès`,
          });

          reset();
        }
      })
      .catch(({ response }) => {
        if (response.status === 409) {
          toast({
            variant: "danger",
            title: "Erreur de duplication",
            description: response.data.error,
          });
        } else {
          setError("site_id", {
            message: response.data.errors.site_id.join(),
          });
          setError("date", {
            message: response.data.errors.date.join(),
          });
          setError("problems", {
            message: response.data.errors.problems.join(),
          });
          setError("delays", {
            message: response.data.errors.delays.join(),
          });
          setError("security", {
            message: response.data.errors.security.join(),
          });
        }
      });
  };

  const updateReport = async (id, values, form) => {
    const { setError, reset } = form;

    return await ReportsApis.update(id, values)
      .then((response) => {
        if (response.status === 200) {
          setReports(
            reports.map((reportItem) =>
              reportItem.id !== id ? reportItem : response.data.report,
            ),
          );

          toast({
            variant: "warning",
            title: "Modification réussie",
            description: `Journal "${response.data.report.code}" a été modifié avec succès`,
          });

          reset();
        }
      })
      .catch(({ response }) => {
        setError("site_id", {
          message: response.data.errors.site_id.join(),
        });
        setError("date", {
          message: response.data.errors.date.join(),
        });
        setError("problems", {
          message: response.data.errors.problems.join(),
        });
        setError("delays", {
          message: response.data.errors.delays.join(),
        });
        setError("security", {
          message: response.data.errors.security.join(),
        });
      });
  };

  const deleteReport = async (report) => {
    return await ReportsApis.delete(report.id)
      .then((response) => {
        if (response.status === 200) {
          setReports(
            reports.filter((reportItem) => reportItem.id !== report.id),
          );

          toast({
            variant: "danger",
            title: "Suppression réussie",
            description: `Journal "${report.code}" a été supprimé avec succès`,
          });
        }
      })
      .catch(({ response }) => {});
  };

  const validateReports = async (id) => {
    try {
      const response = await ReportsApis.validate(id);

      if (response.status === 200) {
        setReports((prevReports) =>
          prevReports.map((report) =>
            report.id === id ? response.data.report : report,
          ),
        );

        await getReports();

        toast({
          variant: "success",
          title: "Validation réussie",
          description: `Le journal "${response?.data?.report?.code || "inconnu"}" a été validé avec succès.`,
        });
      }
    } catch (error) {
      console.error("Erreur lors de la validation :", error);

      toast({
        variant: "danger",
        title: "Erreur de validation",
        description:
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Une erreur est survenue pendant la validation.",
      });
    }
  };

  const invalidateReports = async (id) => {
    try {
      const response = await ReportsApis.invalidate(id);

      if (response.status === 200) {
        setReports((prevReports) =>
          prevReports.map((report) =>
            report.id === id ? response.data.report : report,
          ),
        );

        await getReports();

        toast({
          variant: "success",
          title: "Dévalidation réussie",
          description: `Le journal "${response?.data?.punch?.code || "inconu"}" a été dévalidé avec succés.`,
        });
      }
    } catch (error) {
      toast({
        variant: "danger",
        title: "erreur de dévalidation.",
        description:
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Une erreur est survenue pendant la dévalidation.",
      });
    }
  };

  const downloadReportPDF = async (id) => {
    try {
      const blob = await ReportsApis.downloadPDF(id); // <- déjà un blob
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `journal_chantier_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur téléchargement PDF", error);
    }
  };

  // Télécharger un Excel
  const downloadReportExcel = async (id) => {
    try {
      const blob = await ReportsApis.downloadExcel(id); // <- déjà un blob
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `journal_chantier_${id}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur téléchargement Excel", error);
    }
  };

  return (
    <ReportsContext.Provider
      value={{
        reports,
        getReports,
        sites,
        getSites,
        addReport,
        updateReport,
        deleteReport,
        validateReports,
        invalidateReports,
        downloadReportPDF,
        downloadReportExcel,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
};

export const useReportsContext = () => useContext(ReportsContext);
