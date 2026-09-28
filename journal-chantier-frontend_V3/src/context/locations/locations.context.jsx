import {createContext, useContext, useState} from "react";

import LocationsApis from "../../apis/locations.apis.jsx";

import {useToast} from "../../hooks/use-toast.js";

const LocationsContext = createContext({
    locations: {},
    getLocations: () => {
    },
    addLocation: () => {
    },
    updateLocation: () => {
    },
    deleteLocation: () => {
    },
});

export const LocationsProvider = ({children}) => {
    const [locations, setLocations] = useState([]);

    const {toast} = useToast();

    const getLocations = async () => {
        await LocationsApis.getLocations()
            .then(({data}) => {
                setLocations(data);
            })
            .catch(error => console.warn(error));
    }

    const addLocation = async (values, form) => {
        const {setError, reset} = form;

        return await LocationsApis.create(values)
            .then(response => {
                if (response.status === 201) {
                    setLocations([...locations, response.data.location]);

                    toast({
                        variant: 'success',
                        title: 'Ajout réussi',
                        description: `Emplacement "${response.data.location.name}" a été ajouté avec succès`
                    });

                    reset();
                }
            })
            .catch(({response}) => {
                setError("name", {
                    message: response.data.errors.name.join()
                })
            });
    }

    const updateLocation = async (id, values, form) => {
        const {setError, reset} = form;

        return await LocationsApis.update(id, values)
            .then(response => {
                if (response.status === 200) {
                    setLocations(locations.map(locationItem => locationItem.id !== id ? locationItem : response.data.location));

                    toast({
                        variant: 'warning',
                        title: 'Modification réussie',
                        description: `Emplacement "${response.data.location.name}" a été modifié avec succès`
                    });

                    reset();
                }
            })
            .catch(({response}) => {
                setError("name", {
                    message: response.data.errors.name.join()
                })
            });
    }

    const deleteLocation = async (location) => {
        return await LocationsApis.delete(location.id)
            .then(response => {
                if (response.status === 200) {
                    setLocations(locations.filter(locationItem => locationItem.id !== location.id));

                    toast({
                        variant: 'danger',
                        title: 'Suppression réussie',
                        description: `Emplacement "${location.name}" a été supprimé avec succès`
                    });
                }
            })
            .catch(({response}) => {})
    }

    return (
        <LocationsContext.Provider value={{
            locations, getLocations, addLocation, updateLocation, deleteLocation
        }}>
            {children}
        </LocationsContext.Provider>
    )
};

export const useLocationsContext = () => useContext(LocationsContext);
