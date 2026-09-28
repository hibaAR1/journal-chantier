import {useSidebarContext} from "../../context/sidebar/sidebar.context.jsx";

import {FiMenu} from "react-icons/fi";

import ProfileComponent from "../../components/navbar/profile/profile.component.jsx";

import Line from "../../assets/svg/line.svg";

const NavbarLayout = () => {
    const { toggleSidebar } = useSidebarContext();

    return (
        <div className="relative flex justify-start sm:justify-end items-center h-[12vh] sm:h-[75px] px-3">
            <button onClick={toggleSidebar} className="md:hidden scale-150">
                <FiMenu />
            </button>

            <ProfileComponent />

            <img
                className="w-[120%] absolute bottom-0 left-[50%] translate-x-[-50%]"
                src={Line} alt="line"
            />
        </div>
    )
};

export default NavbarLayout;
