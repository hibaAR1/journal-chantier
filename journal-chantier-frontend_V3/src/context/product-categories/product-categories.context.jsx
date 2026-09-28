import {createContext, useContext, useState} from "react";

import ProductCategoriesApis from "../../apis/product-categories.apis.jsx";

import {useToast} from "../../hooks/use-toast.js";

const ProductCategoriesContext = createContext({
    productCategories: {},
    getProductCategories: () => {
    },
    addProductCategory: () => {
    },
    updateProductCategory: () => {
    },
    deleteProductCategory: () => {
    },
});

export const ProductCategoriesProvider = ({children}) => {
    const [productCategories, setProductCategories] = useState([]);

    const {toast} = useToast();

    const getProductCategories = async () => {
        await ProductCategoriesApis.getProductCategories()
            .then(({data}) => {
                setProductCategories(data);
            })
            .catch(error => console.warn(error));
    }

    const addProductCategory = async (values, form) => {
        const {setError, reset} = form;

        return await ProductCategoriesApis.create(values)
            .then(response => {
                if (response.status === 201) {
                    setProductCategories([...productCategories, response.data.productCategory]);

                    toast({
                        variant: 'success',
                        title: 'Ajout réussi',
                        description: `Catégorie d'articles "${response.data.productCategory.name}" a été ajoutée avec succès`
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

    const updateProductCategory = async (id, values, form) => {
        const {setError, reset} = form;

        return await ProductCategoriesApis.update(id, values)
            .then(response => {
                if (response.status === 200) {
                    setProductCategories(productCategories.map(productCategoryItem => productCategoryItem.id !== id ? productCategoryItem : response.data.productCategory));

                    toast({
                        variant: 'warning',
                        title: 'Modification réussie',
                        description: `Catégorie d'articles "${response.data.productCategory.name}" a été modifiée avec succès`
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

    const deleteProductCategory = async (productCategory) => {
        return await ProductCategoriesApis.delete(productCategory.id)
            .then(response => {
                if (response.status === 200) {
                    setProductCategories(productCategories.filter(productCategoryItem => productCategoryItem.id !== productCategory.id));

                    toast({
                        variant: 'danger',
                        title: 'Suppression réussie',
                        description: `Catégorie d'articles "${productCategory.name}" a été supprimée avec succès`
                    });
                }
            })
            .catch(({response}) => {})
    }

    return (
        <ProductCategoriesContext.Provider value={{
            productCategories, getProductCategories, addProductCategory, updateProductCategory, deleteProductCategory
        }}>
            {children}
        </ProductCategoriesContext.Provider>
    )
};

export const useProductCategoriesContext = () => useContext(ProductCategoriesContext);
