import {useEffect, useState} from "react";

import {useSidebarContext} from '../../context/sidebar/sidebar.context.jsx';

import {Sheet, SheetContent, SheetDescription} from "../../components/ui/sheet.jsx";

import HeaderComponent from "../../components/sidebar/header/header.component.jsx";
import MenuComponent from "../../components/sidebar/menu/menu.component.jsx";
import FooterComponent from "../../components/sidebar/footer/footer.component.jsx";

import {DialogTitle} from "../../components/ui/dialog.jsx";

const SidebarLayout = () => {
    const {isOpen, toggleSidebar, closeSidebar} = useSidebarContext();

    const [isMobile, setIsMobile] = useState(window.matchMedia("(max-width: 768px)").matches);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 768px)");

        const handleChange = (e) => {
            if (!e.matches) {
                closeSidebar();
            }
            setIsMobile(e.matches);
        };

        mediaQuery.addEventListener("change", handleChange);

        // Clean up the event listener
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    return (
        <>
            {/* Sidebar for larger screens */}
            <div className={`
                hidden md:block md:w-[250px] h-full
                fixed left-0 top-0
                rounded-tr-md rounded-br-md
                shadow-[10px_5px_20px_rgba(0,0,0,0.4)]
                bg-white text-black
            `}>
                <HeaderComponent />
                <MenuComponent />
                <FooterComponent />
            </div>

            {/* Sheet for smaller screens */}
            <Sheet
                open={isOpen}
                onOpenChange={toggleSidebar}
            >
                <SheetContent
                    side="left"
                    className={`
                        h-full xs:w-[80%] w-[250px]
                        bg-white text-black
                        rounded-tr-3xl rounded-br-3xl md:rounded-br-md
                    `}
                >
                    <DialogTitle className="hidden">Sidebar</DialogTitle>
                    <HeaderComponent />
                    <MenuComponent />
                    <FooterComponent />
                </SheetContent>
                <SheetDescription/>
            </Sheet>
        </>
    );
};

export default SidebarLayout;
