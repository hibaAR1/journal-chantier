import Logo from "../../../assets/svg/logo.svg";
import Line from "../../../assets/svg/line.svg";

const HeaderComponent = () => {
    return (
        <header className="flex justify-center items-center relative h-[12%] sm:h-[75px]">
            <img
                className="w-[70%] sm:w-[60%]"
                src={Logo} alt="Logo"
            />

            <img
                className="w-[80%] absolute bottom-0 left-[50%] translate-x-[-50%]"
                src={Line} alt="line"
            />
        </header>
    )
}

export default HeaderComponent;
