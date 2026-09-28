import {useState} from "react";

import {useAuthContext} from "../../../context/auth/auth.context.jsx";
import {useSidebarContext} from "../../../context/sidebar/sidebar.context.jsx";

import items from "../../../data/menu.json";

import MenuStyles from "./menu.styles.jsx";

import LinkComponent from "../link/link.component.jsx";

const MenuComponent = () => {
    const [menu, setMenu] = useState(items);

    const {toggleSidebar} = useSidebarContext();

    const {user} = useAuthContext();

    const handleLinkClick = () => toggleSidebar();

    return (
        <MenuStyles
            className={`
                w-100
                overflow-y-scroll
                hideScroll
                px-9
            `}
        >
            <ul
                className={`
                    w-[80%] h-[100%]
                    flex justify-center flex-col gap-[1.25rem]
                    list-none
                    pe-0 ps-[2rem]
                `}
            >
                {menu.map((item, index) => {

                    if (user.permissions?.includes(item.permission)) {
                        return (
                            <li
                                key={index}
                                className={`
                                text-[1rem] sm:text-[1rem]
                                font-semibold
                                relative
                            `}
                            >
                                <LinkComponent index={index} link={item} onClick={handleLinkClick}/>
                            </li>
                        )
                    }
                })}
            </ul>
        </MenuStyles>
    )
};

export default MenuComponent;
