import { createContext, useContext, useState } from "react";

import PunchesApis from "../../apis/punches.apis.jsx";
import SitesApis from "../../apis/sites.apis.jsx";

import { useToast } from "../../hooks/use-toast.js";

const PunchesContext = createContext({
  punches: {},
  getPunches: () => {},
  getSites: () => {},
  addPunch: () => {},
  updatePunch: () => {},
  deletePunch: () => {},
});

export const PunchesProvider = ({ children }) => {
  const [punches, setPunches] = useState([]);
  const [sites, setSites] = useState([]);

  const { toast } = useToast();

  const getPunches = async () => {
    await PunchesApis.getPunches()
      .then(({ data }) => {
        setPunches(Array.isArray(data) ? data : (data?.data ?? []));
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
              label: `${site.name}`,
            };
          }),
        );
      })
      .catch((error) => console.warn(error));
  };

  const addPunch = async (values, form) => {
    const { setError, reset } = form;

    return await PunchesApis.create(values)
      .then((response) => {
        if (response.status === 201) {
          setPunches([...punches, response.data.punch]);

          toast({
            variant: "success",
            title: "Ajout réussi",
            description: `Dossier pointages "${response.data.punch.code}" a été ajouté avec succès`,
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
        }
      });
  };

  const updatePunch = async (id, values, form) => {
    const { setError, reset } = form;

    return await PunchesApis.update(id, values)
      .then((response) => {
        if (response.status === 200) {
          setPunches(
            punches.map((punchItem) =>
              punchItem.id !== id ? punchItem : response.data.punch,
            ),
          );

          toast({
            variant: "warning",
            title: "Modification réussie",
            description: `Dossier pointages "${response.data.punch.code}" a été modifié avec succès`,
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
      });
  };

  const deletePunch = async (punch) => {
    return await PunchesApis.delete(punch.id)
      .then((response) => {
        if (response.status === 200) {
          setPunches(punches.filter((punchItem) => punchItem.id !== punch.id));

          toast({
            variant: "danger",
            title: "Suppression réussie",
            description: `Dossier pointages "${punch.code}" a été supprimé avec succès`,
          });
        }
      })
      .catch(({ response }) => {});
  };
  const validatePunches = async (id) => {
    try {
      const response = await PunchesApis.validate(id);

      if (response.status === 200) {
        setPunches((prevPunches) =>
          prevPunches.map((punch) =>
            punch.id === id ? response.data.punch : punch,
          ),
        );

        await getPunches();

        toast({
          variant: "success",
          title: "Validation réussie",
          description: `Le dossier pointage "${response?.data?.punch?.code || "inconnu"}" a été validé avec succès.`,
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

  const invalidatePunches = async (id) => {
    try {
      const response = await PunchesApis.invalidate(id);

      if (response.status === 200) {
        setPunches((prevPunches) =>
          prevPunches.map((punch) =>
            punch.id === id ? response.data.punch : punch,
          ),
        );

        await getPunches();

        toast({
          variant: "success",
          title: "Dévalidation réussie",
          description: `Le dossier pointage "${response?.data?.punch?.code || "inconnu"}" a été dévalidé avec succès.`,
        });
      }
    } catch (error) {
      toast({
        variant: "danger",
        title: "Erreur de dévalidation",
        description:
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Une erreur est survenue pendant la dévalidation.",
      });
    }
  };

  return (
    <PunchesContext.Provider
      value={{
        punches,
        sites,
        getPunches,
        getSites,
        addPunch,
        updatePunch,
        deletePunch,
        validatePunches,
        invalidatePunches,
      }}
    >
      {children}
    </PunchesContext.Provider>
  );
};

export const usePunchesContext = () => useContext(PunchesContext);
