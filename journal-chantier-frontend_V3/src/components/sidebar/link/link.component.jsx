import {useState} from "react";

import {Link} from "react-router-dom";

import useActiveRoute from "../../../hooks/useActiveRoute.jsx";

import arrowOrange from '../../../assets/svg/arrow-orange.svg';
import arrowGrey from '../../../assets/svg/arrow-grey.svg';

const LinkComponent = ({index, link}) => {
    const activeRoute = useActiveRoute();

    const [isHovered, setIsHovered] = useState(false);

    const {name, title} = link;

    return (
        <Link
            to={name}
            id={`link-${index}`}
            className={`
                group font-medium
                block cursor-pointer transition-all
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img
                className={`
                    group-hover:scale-[1.25]
                    h-[1rem] w-[1rem]
                    absolute
                    left-[-1.5rem] top-[50%]
                    translate-x-[-50%] translate-y-[-50%]
                `}
                src={activeRoute === name || isHovered ? arrowOrange : arrowGrey}
                alt="Arrow"
            />

            <span
                className={`
                    group-hover:text-primary-600
                    ${activeRoute === name ? 'text-primary-600' : ""}
                `}
            >
                {title}
            </span>
        </Link>)
};

export default LinkComponent;
