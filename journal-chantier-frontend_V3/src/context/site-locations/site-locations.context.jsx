import {createContext, useContext, useState} from "react";

import {useToast} from "../../hooks/use-toast.js";

import SitesApis from "../../apis/sites.apis.jsx";
import SiteLocationApis from "../../apis/site-location.apis.jsx";
import LocationsApis from "../../apis/locations.apis.jsx";

const SiteLocationsContext = createContext({
    site: {},
    siteLocations: {},
    locations: {},
    getSite: () => {},
    getSiteLocations: () => {},
    getLocations: () => {},
    addSiteLocation: () => {},
    updateSiteLocation: () => {},
    deleteSiteLocation: () => {},
});

export const SiteLocationsProvider = ({children}) => {
    const [site, setSite] = useState([]);
    const [siteLocations, setSiteLocations] = useState([]);
    const [locations, setLocations] = useState([]);

    const {toast} = useToast();

    const getSite = async id => {
        await SitesApis.getSite(id)
            .then(({data}) => {
                console.log(data);
                setSite(data.site);
            })
            .catch(error => console.warn(error));
    };

    const getSiteLocations = async (siteId) => {
        await SiteLocationApis.getSiteLocations(siteId)
            .then(({data}) => {
                console.log('site locations', data)
                setSiteLocations(data);
            })
            .catch(error => console.warn(error));
    }

    const getLocations = async () => {
        await LocationsApis.getLocations()
            .then(({data}) => {
                setLocations(data.map(location => {
                    return {
                        value: location.id,
                        label: `${location.name}`
                    }
                }));
            })
            .catch(error => {});
    }

    const addSiteLocation = async (values, form, siteId) => {
        const {setError, reset} = form;

        const payload = {...values, site_id: siteId};

        return await SiteLocationApis.create(payload)
            .then(response => {
                if (response.status === 201) {
                    setSiteLocations([...siteLocations, response.data.siteLocation]);

                    toast({
                        variant: 'success',
                        title: 'Ajout réussi',
                        description: `Emplacement chantier a été ajouté avec succès`
                    });

                    reset();
                }
            })
            .catch(({response}) => {
                setError("location_id", {
                    message: response.data.errors.location_id.join()
                })
                setError("block", {
                    message: response.data.errors.block.join()
                })
                setError("element", {
                    message: response.data.errors.element.join()
                })
            });
    }

    const updateSiteLocation = async (id, values, form, siteId) => {
        const {setError, reset} = form;

        const payload = {...values, site_id: siteId};

        return await SiteLocationApis.update(id, payload)
            .then(response => {
                if (response.status === 200) {
                    setSiteLocations(siteLocations.map(siteLocationItem => siteLocationItem.id !== id ? siteLocationItem : response.data.siteLocation));

                    toast({
                        variant: 'warning',
                        title: 'Modification réussie',
                        description: `Emplacement chantier a été modifié avec succès`
                    });

                    reset();
                }
            })
            .catch(({response}) => {
                setError("location_id", {
                    message: response.data.errors.location_id.join()
                })
                setError("block", {
                    message: response.data.errors.block.join()
                })
                setError("element", {
                    message: response.data.errors.element.join()
                })
            });
    }

    const deleteSiteLocation = async (siteLocation) => {
        await SiteLocationApis.delete(siteLocation.id)
            .then(response => {
                if (response.status === 200) {
                    setSiteLocations(siteLocations.filter(siteLocationItem => siteLocationItem.id !== siteLocation.id));

                    toast({
                        variant: 'danger',
                        title: 'Suppression réussie',
                        description: `Emplacement chantier a été supprimé avec succès`
                    });
                }
            })
            .catch(error => console.warn(error));
    }

    return (
        <SiteLocationsContext.Provider value={{
            site, siteLocations, locations, getSite, getSiteLocations, getLocations, addSiteLocation, updateSiteLocation, deleteSiteLocation
        }}>
            {children}
        </SiteLocationsContext.Provider>
    )
};

export const useSiteLocationsContext = () => useContext(SiteLocationsContext);
