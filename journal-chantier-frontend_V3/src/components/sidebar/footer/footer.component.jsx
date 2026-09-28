import Slogan from "../../../assets/svg/slogan.svg";
import Line from "../../../assets/svg/line.svg";

const FooterComponent = () => {
    return (
        <footer className="flex justify-center items-center relative h-[12%] sm:h-[75px]">
            <img
                className="w-[70%] sm:w-[60%]"
                src={Slogan} alt="Slogan"
            />

            <img
                className="w-[80%] absolute top-0 left-[50%] translate-x-[-50%]"
                src={Line} alt="line"
            />
        </footer>
    )
}

export default FooterComponent;
