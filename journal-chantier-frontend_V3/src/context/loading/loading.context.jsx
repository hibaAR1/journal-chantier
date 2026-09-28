import {createContext, useContext, useState} from "react";

const LoadingContext = createContext({
    loading: false,
    importLoading: false,
    exportLoading: false,
    setLoading: () => {},
    setImportLoading: () => {},
    setExportLoading: () => {},
});

export const LoadingProvider = ({children}) => {
    const [loading, setLoading] = useState(false);
    const [importLoading, setImportLoading] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{
            loading,
            importLoading,
            exportLoading,
            setLoading,
            setImportLoading,
            setExportLoading
        }}>
            {children}
        </LoadingContext.Provider>
    )
}

export const useLoadingContext = () => useContext(LoadingContext);
