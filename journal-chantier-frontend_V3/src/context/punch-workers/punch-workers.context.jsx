import { createContext, useContext, useState } from "react";

import { saveAs } from "file-saver";

import PunchesApis from "../../apis/punches.apis.jsx";
import WorkersApis from "../../apis/workers.apis.jsx";
import PunchWorkersApis from "../../apis/punch-worker.apis.jsx";

import { useToast } from "../../hooks/use-toast.js";
import { useLoadingContext } from "../loading/loading.context.jsx";

const PunchWorkersContext = createContext({
  punch: {},
  workers: {},
  punchWorkers: {},
  getPunch: () => {},
  getWorkers: () => {},
  getPunchWorkers: () => {},
  addPunchWorker: () => {},
  updatePunchWorker: () => {},
  deletePunchWorker: () => {},
  exportPunchWorkers: () => {},
  uploadPunchWorkers: () => {},
});

export const PunchWorkersProvider = ({ children }) => {
  const { setImportLoading, setExportLoading, setLoading } =
    useLoadingContext();

  const [punch, setPunch] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [punchWorkers, setPunchWorkers] = useState([]);

  const { toast } = useToast();

  // Erreurs du serveur → sous chaque champ du formulaire + message d'alerte.
  // Ex. CDC § 3.4.2 : « Ali a déjà 8 h normales le 28/09/2026 (hiba) : maximum 1 h possibles ici… »
  const showErrors = (response, setError, title) => {
    const errors = response?.data?.errors ?? {};

    ["worker_id", "type", "natural_hours", "overtime_hours"].forEach(
      (field) => {
        if (errors[field]) {
          setError(field, { message: errors[field].join(" ") });
        }
      },
    );

    const firstMessage =
      Object.values(errors)[0]?.[0] ?? response?.data?.message;

    toast({
      variant: "danger",
      title,
      description: firstMessage ?? "Une erreur s'est produite.",
    });
  };

  const getPunch = async (id) => {
    await PunchesApis.getPunch(id)
      .then(({ data }) => {
        setPunch(data);
      })
      .catch((error) => console.warn(error));
  };

  const getWorkers = async () => {
    // Situation Actuelle (CDC § 3.3.2) : seuls les ouvriers ACTIF sont proposés
    await WorkersApis.getWorkers({ active_only: 1 })
      .then(({ data }) => {
        setWorkers(
          data.map((worker) => {
            return {
              value: worker.id,
              label: `${worker.registration_number} -- ${worker.name}`,
              resource_name: worker.resource_name,
            };
          }),
        );
      })
      .catch((error) => console.warn(error));
  };

  const getPunchWorkers = async (punchId) => {
    await PunchWorkersApis.getPunchWorkers(punchId)
      .then(({ data }) => {
        console.log("PunchWorkers", data);
        setPunchWorkers(data);
      })
      .catch((error) => console.warn(error));
  };

  const addPunchWorker = async (values, form, punchId) => {
    const { setError, reset } = form;
    const payload = {
      ...values,
      punch_id: punchId,
      direct:
        values.direct === true || values.direct === "true"
          ? 1
          : values.direct === false || values.direct === "false"
            ? 0
            : null,
    };

    return await PunchWorkersApis.create(payload)
      .then((response) => {
        if (response.status === 201) {
          setPunchWorkers([...punchWorkers, response.data.punchWorker]);

          toast({
            variant: "success",
            title: "Ajout réussi",
            description: `Pointage du "${response.data.punchWorker.worker_name}" a été ajouté avec succès`,
          });

          reset();
        }
      })
      .catch(({ response }) =>
        showErrors(response, setError, "Ajout impossible"),
      );
  };

  const updatePunchWorker = async (id, values, form, punchId) => {
    const { setError, reset } = form;

    const payload = {
      ...values,
      punch_id: punchId,
      direct:
        values.direct === true || values.direct === "true"
          ? 1
          : values.direct === false || values.direct === "false"
            ? 0
            : null,
    };

    return await PunchWorkersApis.update(id, payload)
      .then((response) => {
        if (response.status === 200) {
          setPunchWorkers(
            punchWorkers.map((punchWorkerItem) =>
              punchWorkerItem.id !== id
                ? punchWorkerItem
                : response.data.punchWorker,
            ),
          );

          toast({
            variant: "warning",
            title: "Modification réussie",
            description: `Pointage du "${response.data.punchWorker.worker_name}" a été modifié avec succès`,
          });

          reset();
        }
      })
      .catch(({ response }) =>
        showErrors(response, setError, "Modification impossible"),
      );
  };

  const deletePunchWorker = async (punchWorker) => {
    return await PunchWorkersApis.delete(punchWorker.id)
      .then((response) => {
        if (response.status === 200) {
          setPunchWorkers(
            punchWorkers.filter(
              (punchWorkerItem) => punchWorkerItem.id !== punchWorker.id,
            ),
          );

          toast({
            variant: "danger",
            title: "Suppression réussie",
            description: `Pointage du "${punchWorker.worker_name}" a été supprimé avec succès`,
          });
        }
      })
      .catch(({ response }) => {});
  };

  const exportPunchWorkers = async (punchId) => {
    setExportLoading(true);
    return await PunchWorkersApis.export(punchId)
      .then((response) => {
        const contentDisposition = response.headers["content-disposition"];
        const fileNameMatch =
          contentDisposition &&
          contentDisposition.match(/filename="?([^"]+)"?/);
        const fileName = fileNameMatch ? fileNameMatch[1] : "pointage.xlsx";

        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(blob, fileName);

        toast({
          variant: "success",
          title: "Téléchargement réussi",
          description: `Le fichier a été téléchargé avec succès`,
        });

        setExportLoading(false);
      })
      .catch(({ response }) => {
        setExportLoading(false);
      });
  };

  const uploadPunchWorkers = async (values, form, punchId) => {
    const { setError, reset } = form;

    const handleSuccess = async () => {
      await getPunchWorkers(punchId);

      toast({
        variant: "success",
        title: "Importation réussie",
        description: `Pointages des ouvriers ont été importés avec succès`,
      });

      setImportLoading(false);
      setLoading(false);
    };

    setImportLoading(true);
    setLoading(true);

    return await PunchWorkersApis.upload(values)
      .then(async () => {
        await handleSuccess();
      })
      .catch((error) => {
        console.error("Full Axios error:", error);

        console.log("Status:", error.response?.status);
        console.log("Response:", error.response?.data);

        alert(JSON.stringify(error.response?.data, null, 2));

        toast({
          variant: "danger",
          title: "Importation echouée",
          description:
            error.response?.data?.error ||
            error.response?.data?.message ||
            "Erreur inconnue",
        });

        setImportLoading(false);
        setLoading(false);
      });
  };

  return (
    <PunchWorkersContext.Provider
      value={{
        punch,
        workers,
        punchWorkers,
        getPunch,
        getWorkers,
        getPunchWorkers,
        addPunchWorker,
        updatePunchWorker,
        deletePunchWorker,
        exportPunchWorkers,
        uploadPunchWorkers,
      }}
    >
      {children}
    </PunchWorkersContext.Provider>
  );
};

export const usePunchWorkersContext = () => useContext(PunchWorkersContext);
