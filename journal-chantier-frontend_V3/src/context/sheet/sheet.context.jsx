import {createContext, useContext, useState} from "react";

const SheetContext = createContext({
    isOpen: null,
    setIsOpen: () => {},
    sheetId: null,
    setSheetId: () => {},
    closeSheet: () => {}
});

export const SheetProvider = ({children}) => {
    const [isOpen, setIsOpen] = useState(false);

    const [sheetId, setSheetId] = useState(null);
    const closeSheet = () => setIsOpen(false);

    return (
        <SheetContext.Provider value={{isOpen, setIsOpen, closeSheet, sheetId, setSheetId}}>
            {children}
        </SheetContext.Provider>
    )
}

export const useSheetContext = () => useContext(SheetContext);
