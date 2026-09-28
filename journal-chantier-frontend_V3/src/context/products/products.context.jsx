import {createContext, useContext, useState} from "react";

import ProductsApis from "../../apis/products.apis.jsx";
import ProductCategoriesApis from "../../apis/product-categories.apis.jsx";

import {useToast} from "../../hooks/use-toast.js";

const ProductsContext = createContext({
    products: {},
    productCategories: {},
    getProducts: () => {},
    getProductCategories: () => {},
    addProduct: () => {},
    updateProduct: () => {},
    deleteProduct: () => {},
});

export const ProductsProvider = ({children}) => {
    const [products, setProducts] = useState([]);
    const [productCategories, setProductCategories] = useState([]);

    const {toast} = useToast();

    const getProducts = async () => {
        await ProductsApis.getProducts()
            .then(({data}) => {
                setProducts(data);
            })
            .catch(error => console.warn(error));
    }

    const getProductCategories = async () => {
        await ProductCategoriesApis.getProductCategories()
            .then(({data}) => {
                setProductCategories(data.map(category => {
                    return {
                        value: category.id,
                        label: category.name
                    }
                }));
            })
            .catch(error => console.warn(error));
    }

    const addProduct = async (values, form) => {
        const {setError, reset} = form;

        return await ProductsApis.create(values)
            .then(response => {
                if (response.status === 201) {
                    setProducts([...products, response.data.product]);

                    toast({
                        variant: 'success',
                        title: 'Ajout réussi',
                        description: `Article "${response.data.product.name}" a été ajouté avec succès`
                    });

                    reset();
                }
            })
            .catch(({response}) => {
                setError("product_category_id", {
                    message: response.data.errors.product_category_id.join()
                })
                setError("name", {
                    message: response.data.errors.name.join()
                })
                setError("unit", {
                    message: response.data.errors.unit.join()
                })
            });
    }

    const updateProduct = async (id, values, form) => {
        const {setError, reset} = form;

        return await ProductsApis.update(id, values)
            .then(response => {
                if (response.status === 200) {
                    setProducts(products.map(productItem => productItem.id !== id ? productItem : response.data.product));

                    toast({
                        variant: 'warning',
                        title: 'Modification réussie',
                        description: `Article "${response.data.product.name}" a été modifié avec succès`
                    });

                    reset();
                }
            })
            .catch(({response}) => {
                setError("product_category_id", {
                    message: response.data.errors.product_category_id.join()
                })
                setError("name", {
                    message: response.data.errors.name.join()
                })
                setError("unit", {
                    message: response.data.errors.unit.join()
                })
            });
    }

    const deleteProduct = async (product) => {
        return await ProductsApis.delete(product.id)
            .then(response => {
                if (response.status === 200) {
                    setProducts(products.filter(productItem => productItem.id !== product.id));

                    toast({
                        variant: 'danger',
                        title: 'Suppression réussie',
                        description: `Article "${product.name}" a été supprimé avec succès`
                    });
                }
            })
            .catch(({response}) => {})
    }

    return (
        <ProductsContext.Provider value={{
            products, productCategories, getProducts, getProductCategories, addProduct, updateProduct, deleteProduct
        }}>
            {children}
        </ProductsContext.Provider>
    )
};

export const useProductsContext = () => useContext(ProductsContext);
