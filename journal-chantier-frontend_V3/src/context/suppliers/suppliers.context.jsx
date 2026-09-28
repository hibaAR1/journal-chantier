import {createContext, useContext, useState} from "react";

import SuppliersApis from "../../apis/suppliers.apis.jsx";

import {useToast} from "../../hooks/use-toast.js";

const SuppliersContext = createContext({
    suppliers: {},
    getSuppliers: () => {
    },
    addSupplier: () => {
    },
    updateSupplier: () => {
    },
    deleteSupplier: () => {
    },
});

export const SuppliersProvider = ({children}) => {
    const [suppliers, setSuppliers] = useState([]);

    const {toast} = useToast();

    const getSuppliers = async () => {
        await SuppliersApis.getSuppliers()
            .then(({data}) => {
                setSuppliers(data);
            })
            .catch(error => console.warn(error));
    }

    const addSupplier = async (values, form) => {
        const {setError, reset} = form;

        return await SuppliersApis.create(values)
            .then(response => {
                if (response.status === 201) {
                    setSuppliers([...suppliers, response.data.supplier]);

                    toast({
                        variant: 'success',
                        title: 'Ajout réussi',
                        description: `Fournisseur "${response.data.supplier.registered_name}" a été ajouté avec succès`
                    });

                    reset();
                }
            })
            .catch(({response}) => {
                setError("registered_name", {
                    message: response.data.errors.registered_name.join()
                })
                setError("code_system", {
                    message: response.data.errors.code_system.join()
                })
            });
    }

    const updateSupplier = async (id, values, form) => {
        const {setError, reset} = form;

        return await SuppliersApis.update(id, values)
            .then(response => {
                if (response.status === 200) {
                    setSuppliers(suppliers.map(supplierItem => supplierItem.id !== id ? supplierItem : response.data.supplier));

                    toast({
                        variant: 'warning',
                        title: 'Modification réussie',
                        description: `Fournisseur "${response.data.supplier.registered_name}" a été modifié avec succès`
                    });

                    reset();
                }
            })
            .catch(({response}) => {
                setError("registered_name", {
                    message: response.data.errors.registered_name.join()
                })
                setError("code_system", {
                    message: response.data.errors.code_system.join()
                })
            });
    }

    const deleteSupplier = async (supplier) => {
        return await SuppliersApis.delete(supplier.id)
            .then(response => {
                if (response.status === 200) {
                    setSuppliers(suppliers.filter(supplierItem => supplierItem.id !== supplier.id));

                    toast({
                        variant: 'danger',
                        title: 'Suppression réussie',
                        description: `Fournisseur "${supplier.registered_name}" a été supprimé avec succès`
                    });
                }
            })
            .catch(({response}) => {})
    }

    return (
        <SuppliersContext.Provider value={{
            suppliers, getSuppliers, addSupplier, updateSupplier, deleteSupplier
        }}>
            {children}
        </SuppliersContext.Provider>
    )
};

export const useSuppliersContext = () => useContext(SuppliersContext);
