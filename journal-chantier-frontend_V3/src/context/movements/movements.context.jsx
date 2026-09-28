import {createContext, useContext, useState} from "react";

import MovementsApis from "../../apis/movements.apis.jsx";

import {useToast} from "../../hooks/use-toast.js";
import SitesApis from "../../apis/sites.apis.jsx";
import SuppliersApis from "../../apis/suppliers.apis.jsx";
import ProductsApis from "../../apis/products.apis.jsx";

const MovementsContext = createContext({
    movements: {},
    getMovements: () => {},
    sites: {},
    getSites: () => {},
    products: {},
    getProducts: () => {},
    suppliers: {},
    getSuppliers: () => {},
    addMovement: () => {},
    updateMovement: () => {},
    deleteMovement: () => {},
});

export const MovementsProvider = ({children}) => {
    const [movements, setMovements] = useState([]);
    const [sites, setSites] = useState([]);
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const {toast} = useToast();

    const getMovements = async () => {
        await MovementsApis.getMovements()
            .then(({data}) => {
                setMovements(data);
            })
            .catch(error => console.warn(error));
    }

    const getSites = async () => {
        await SitesApis.getSites()
            .then(({data}) => {
                setSites(data.map(site => {
                    return {
                        value: site.id,
                        label: site.name
                    }
                }));
            })
            .catch(error => console.warn(error));
    }

    const getProducts = async () => {
        await ProductsApis.getProducts()
            .then(({data}) => {
                setProducts(data.map(product => {
                    return {
                        value: product.id,
                        label: product.name
                    }
                }));
            })
            .catch(error => console.warn(error));
    }

    const getSuppliers = async () => {
        await SuppliersApis.getSuppliers()
            .then(({data}) => {
                setSuppliers(data.map(supplier => {
                    return {
                        value: supplier.id,
                        label: `${supplier.code_system} - ${supplier.registered_name}`
                    }
                }));
            })
            .catch(error => console.warn(error));
    }

    const addMovement = async (values, form) => {
        const {setError, reset} = form;

        return await MovementsApis.create(values)
            .then(response => {
                if (response.status === 201) {
                    setMovements([...movements, response.data.movement]);

                    toast({
                        variant: 'success',
                        title: 'Ajout réussi',
                        description: `Mouvement "${response.data.movement.code}" a été ajouté avec succès`
                    });

                    reset();
                }
            })
            .catch(({response}) => {
                setError("site_id", {
                    message: response.data.errors.site_id.join()
                })
                setError("product_id", {
                    message: response.data.errors.product_id.join()
                })
                setError("supplier_id", {
                    message: response.data.errors.supplier_id.join()
                })
                setError("date", {
                    message: response.data.errors.date.join()
                })
                setError("type", {
                    message: response.data.errors.type.join()
                })
                setError("quantity", {
                    message: response.data.errors.quantity.join()
                })
                setError("delivery_num", {
                    message: response.data.errors.delivery_num.join()
                })
                setError("receipt_num", {
                    message: response.data.errors.receipt_num.join()
                })
                setError("exit_num", {
                    message: response.data.errors.exit_num.join()
                })
                setError("observation", {
                    message: response.data.errors.observation.join()
                })
            });
    }

    const updateMovement = async (id, values, form) => {
        const {setError, reset} = form;

        return await MovementsApis.update(id, values)
            .then(response => {
                if (response.status === 200) {
                    setMovements(movements.map(movementItem => movementItem.id !== id ? movementItem : response.data.movement));

                    toast({
                        variant: 'warning',
                        title: 'Modification réussie',
                        description: `Mouvement "${response.data.movement.code}" a été modifié avec succès`
                    });

                    reset();
                }
            })
            .catch(({response}) => {
                setError("site_id", {
                    message: response.data.errors.site_id.join()
                })
                setError("product_id", {
                    message: response.data.errors.product_id.join()
                })
                setError("supplier_id", {
                    message: response.data.errors.supplier_id.join()
                })
                setError("date", {
                    message: response.data.errors.date.join()
                })
                setError("type", {
                    message: response.data.errors.type.join()
                })
                setError("quantity", {
                    message: response.data.errors.quantity.join()
                })
                setError("delivery_num", {
                    message: response.data.errors.delivery_num.join()
                })
                setError("receipt_num", {
                    message: response.data.errors.receipt_num.join()
                })
                setError("exit_num", {
                    message: response.data.errors.exit_num.join()
                })
                setError("observation", {
                    message: response.data.errors.observation.join()
                })
            });
    }

    const deleteMovement = async (movement) => {
        return await MovementsApis.delete(movement.id)
            .then(response => {
                if (response.status === 200) {
                    setMovements(movements.filter(movementItem => movementItem.id !== movement.id));

                    toast({
                        variant: 'danger',
                        title: 'Suppression réussie',
                        description: `Mouvement "${movement.code}" a été supprimé avec succès`
                    });
                }
            })
            .catch(({response}) => {})
    }

    return (
        <MovementsContext.Provider value={{
            movements, getMovements, sites, getSites, products, getProducts, suppliers, getSuppliers, addMovement, updateMovement, deleteMovement
        }}>
            {children}
        </MovementsContext.Provider>
    )
};

export const useMovementsContext = () => useContext(MovementsContext);
